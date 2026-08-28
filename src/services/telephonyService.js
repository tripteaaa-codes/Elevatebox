const twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const publicUrl = process.env.PUBLIC_URL;

console.log("=== TWILIO CONFIG ===");
console.log("Account SID loaded:", !!accountSid);
console.log("Account SID length:", accountSid?.length);
console.log("Auth Token loaded:", !!authToken);
console.log("Auth Token length:", authToken?.length);
console.log("Twilio phone loaded:", !!twilioPhoneNumber);
console.log("Twilio phone:", twilioPhoneNumber);
console.log("Public URL:", publicUrl);
console.log("=====================");


const client = twilio(accountSid, authToken);

const placeCall = async (phoneNumber) => {
    try {
        if (!accountSid || !authToken) {
            throw new Error("Twilio credentials are missing in .env");
        }

        if (!twilioPhoneNumber) {
            throw new Error("TWILIO_PHONE_NUMBER is missing in .env");
        }

        if (!publicUrl) {
            throw new Error("PUBLIC_URL is missing in .env");
        }

        if (!phoneNumber) {
            throw new Error("Phone number is required");
        }

        // Make sure the destination is in E.164 format
        if (!phoneNumber.startsWith("+")) {
            throw new Error(
                "Phone number must be in E.164 format, e.g. +919162270705"
            );
        }

        console.log("Starting Twilio call...");
        console.log("From:", twilioPhoneNumber);
        console.log("To:", phoneNumber);
        console.log("TwiML URL:", `${publicUrl}/api/call/twiml`);

        const call = await client.calls.create({
            from: twilioPhoneNumber,
            to: phoneNumber,
            url: `${publicUrl}/api/call/twiml`
        });

        console.log("Call created successfully:", call.sid);

        return {
            success: true,
            message: "Call started successfully",
            callSid: call.sid,
            phoneNumber
        };

    } catch (error) {

        console.error("========== TWILIO ERROR ==========");
        console.error("Status:", error.status);
        console.error("Code:", error.code);
        console.error("Message:", error.message);
        console.error("More info:", error.moreInfo);
        console.error("Full error:", error);
        console.error("==================================");

        return {
            success: false,
            message: "Failed to place call",
            error: error.message,
            code: error.code,
            status: error.status
        };
    }
};

module.exports = {
    placeCall
};
