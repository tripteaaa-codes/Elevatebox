const twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

const placeCall = async (phoneNumber) => {
    try {
        const call = await client.calls.create({
            from: twilioPhoneNumber,
            to: phoneNumber,
            twiml: `
                <Response>
                    <Say>
                        Hello! This is the ElevateBox AI sales assistant.
                    </Say>
                </Response>
            `
        });

        console.log("Call created:", call.sid);

        return {
            success: true,
            message: "Call started successfully",
            callSid: call.sid,
            phoneNumber
        };

    } catch (error) {
        console.error("Twilio error:", error.message);

        return {
            success: false,
            message: "Failed to place call",
            error: error.message
        };
    }
};

module.exports = {
    placeCall
};