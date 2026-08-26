const express = require("express");

const router = express.Router();

const { placeCall } = require("../services/telephonyService");

router.post("/start", async (req, res) => {
    try {
        const { phoneNumber } = req.body;

        console.log("Phone number received:", phoneNumber);

        if (!phoneNumber) {
            return res.status(400).json({
                success: false,
                message: "Phone number is required"
            });
        }

        const result = await placeCall(phoneNumber);

        console.log("placeCall result:", result);

        if (!result.success) {
            console.error("Call failed:", result);

            return res.status(500).json({
                success: false,
                message: result.message,
                error: result.error
            });
        }

        res.status(200).json(result);

    } catch (error) {
        console.error("========== CALL ERROR ==========");
        console.error(error);
        console.error("Message:", error.message);
        console.error("Code:", error.code);
        console.error("Stack:", error.stack);
        console.error("================================");

        res.status(500).json({
            success: false,
            message: "Failed to place call",
            error: error.message
        });
    }
});

router.post("/twiml", (req, res) => {
    res.type("text/xml");

    res.send(`
        <Response>
            <Gather
                input="speech"
                action="${process.env.PUBLIC_URL}/api/call/process"
                method="POST"
                speechTimeout="auto"
            >
                <Say>
                    Hello! This is the ElevateBox AI sales assistant.
                    How can I help you today?
                </Say>
            </Gather>

            <Say>
                I didn't hear anything. Goodbye!
            </Say>
        </Response>
    `);
});

router.post("/process", async (req, res) => {
    try {
        const speech = req.body.SpeechResult;

        console.log("Customer said:", speech);

        res.type("text/xml");

        res.send(`
            <Response>
                <Say>
                    You said: ${speech}
                </Say>
            </Response>
        `);

    } catch (error) {
        console.error("Speech processing error:", error);

        res.status(500).send("Error processing speech");
    }
});

module.exports = router;