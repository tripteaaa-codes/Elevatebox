const express = require("express");

const router = express.Router();

const { placeCall } = require("../services/telephonyService");

const publicUrl = process.env.PUBLIC_URL;

router.post("/start", async (req, res) => {

    try {

        const { phoneNumber } = req.body;

        if (!phoneNumber) {

            return res.status(400).json({
                success: false,
                message: "Phone number is required"
            });

        }

        const result = await placeCall(phoneNumber);

        if (!result.success) {

            console.error("Call failed:", result);

            return res.status(500).json(result);

        }

        res.status(200).json(result);

    } catch (error) {

        console.error("Call route error:", error);

        res.status(500).json({
            success: false,
            message: "Call route failed",
            error: error.message
        });

    }

});

router.post("/twiml", (req, res) => {

    console.log("Twilio requested TwiML");

    res.type("text/xml");

    res.send(`
        <Response>

            <Gather
                input="speech"
                action="${publicUrl}/api/call/process"
                method="POST"
                speechTimeout="auto"
            >

                <Say>
                    Hello! This is the ElevateBox AI sales assistant.
                    Are you looking for a new e-commerce website?
                </Say>

            </Gather>

            <Say>
                I didn't hear a response. Goodbye!
            </Say>

        </Response>
    `);

});

router.post("/process", (req, res) => {

    const speech = req.body.SpeechResult || "";

    console.log("Customer speech:", speech);

    res.type("text/xml");

    res.send(`
        <Response>

            <Say>
                Thanks for your response.
                You said: ${speech}
            </Say>

            <Gather
                input="speech"
                action="${publicUrl}/api/call/process"
                method="POST"
                speechTimeout="auto"
            >

                <Say>
                    What type of products do you sell?
                </Say>

            </Gather>

            <Say>
                I didn't hear a response. Goodbye!
            </Say>

        </Response>
    `);

});


module.exports = router;

