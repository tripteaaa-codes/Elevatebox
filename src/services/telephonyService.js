const twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const publicUrl = process.env.PUBLIC_URL;

const client = twilio(accountSid, authToken);

const placeCall = async (phoneNumber) => {
    try {
        if (!publicUrl) {
            throw new Error("PUBLIC_URL is not configured in .env");
        }

        const call = await client.calls.create({
            from: twilioPhoneNumber,
            to: phoneNumber,
            url: `${publicUrl}/api/call/twiml`
        });

        console.log("Call created:", call.sid);

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
        console.error("=================================");

        return {
            success: false,
            message: error.message,
            errorCode: error.code,
            status: error.status
        };
    }
};

module.exports = {
    placeCall
};