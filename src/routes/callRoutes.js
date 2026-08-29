const express = require("express");

const router = express.Router();

const { placeCall } = require("../services/telephonyService");
const { classifyLead } = require("../ai/leadClassifier");

const {
    createConversation,
    getConversation,
    addMessage,
    updateConversation
} = require("../ai/conversationManager");

const { generateResponse } = require("../services/aiService");

router.post("/start", async (req, res) => {
    try {
        const { phoneNumber } = req.body || {};

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

        createConversation(
            result.callSid,
            phoneNumber
        );

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

    const callSid = req.body?.CallSid;

    console.log("Call SID:", callSid);

    if (!callSid) {
        return res.status(400).send(`
            <Response>
                <Say>
                    Sorry, something went wrong with the call.
                </Say>
            </Response>
        `);
    }

    let conversation = getConversation(callSid);

    if (!conversation) {
        conversation = createConversation(
            callSid,
            req.body?.To
        );
    }

    addMessage(
        callSid,
        "assistant",
        "Hello! I'm calling from ElevateBox. We help businesses build e-commerce websites. Are you currently looking to sell your products online?"
    );

    res.type("text/xml");

    res.send(`
        <Response>
            <Gather
                input="speech"
                action="${process.env.PUBLIC_URL}/api/call/process"
                method="POST"
                speechTimeout="auto"
                language="en-IN"
            >
                <Say language="en-IN">
                    Hello! I'm calling from ElevateBox.
                    We help businesses build e-commerce websites.
                    Are you currently looking to sell your products online?
                </Say>
            </Gather>

            <Say language="en-IN">
                I didn't hear a response. Goodbye!
            </Say>
        </Response>
    `);
});

router.post("/process", async (req, res) => {
    try {
        const speech = req.body?.SpeechResult || "";
        const callSid = req.body?.CallSid;

        console.log("Customer speech:", speech);
        console.log("Call SID:", callSid);

        if (!callSid) {
            return res.status(400).send(`
                <Response>
                    <Say>
                        Sorry, something went wrong with the call.
                    </Say>
                </Response>
            `);
        }

        let conversation = getConversation(callSid);

        if (!conversation) {
            conversation = createConversation(
                callSid,
                req.body?.From
            );
        }

        addMessage(
            callSid,
            "customer",
            speech
        );

        const response = await generateResponse(
            speech,
            conversation
        );

        console.log("AI response:", response);

        addMessage(
            callSid,
            "assistant",
            response
        );

        updateConversation(callSid, {
            lastUserMessage: speech,
            lastAssistantMessage: response
        });

        const classification = classifyLead(conversation);

        updateConversation(callSid, {
            leadScore: classification.score,
            leadStatus: classification.status
        });

        console.log("Lead classification:", classification);

        res.type("text/xml");

        res.send(`
            <Response>
                <Gather
                    input="speech"
                    action="${process.env.PUBLIC_URL}/api/call/process"
                    method="POST"
                    speechTimeout="auto"
                    language="en-IN"
                >
                    <Say language="en-IN">
                        ${escapeXml(response)}
                    </Say>
                </Gather>

                <Say language="en-IN">
                    Thank you for your time. Have a wonderful day!
                </Say>
            </Response>
        `);

    } catch (error) {
        console.error("Speech processing error:", error);

        res.status(500).send(`
            <Response>
                <Say>
                    I'm sorry, there was a technical problem.
                    Thank you for your time.
                </Say>
            </Response>
        `);
    }
});

function escapeXml(text) {
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

module.exports = router;
