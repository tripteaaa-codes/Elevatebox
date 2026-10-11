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

const { detectLanguage } = require("../ai/languageDetector");
const { saveLead } = require("../services/leadStore");
const { generateResponse } = require("../services/aiService");

const languageConfig = {
    en: {
        locale: "en-IN",
        greeting: "Hello! I'm calling from ElevateBox. We help businesses build e-commerce websites. Are you currently looking to sell your products online?",
        goodbye: "Thank you for your time. Have a wonderful day!",
        error: "I'm sorry, there was a technical problem. Thank you for your time."
    },
    hi: {
        locale: "hi-IN",
        greeting: "नमस्ते! मैं ElevateBox से बात कर रहा हूँ। हम व्यवसायों के लिए ऑनलाइन स्टोर बनाने में मदद करते हैं। क्या आप अपने उत्पाद ऑनलाइन बेचना चाहते हैं?",
        goodbye: "आपके समय के लिए धन्यवाद। आपका दिन शुभ हो!",
        error: "माफ़ कीजिए, तकनीकी समस्या आ गई है। आपके समय के लिए धन्यवाद।"
    },
    te: {
        locale: "te-IN",
        greeting: "నమస్కారం! నేను ElevateBox నుండి మాట్లాడుతున్నాను. మేము వ్యాపారాల కోసం ఆన్‌లైన్ స్టోర్‌లను రూపొందించడంలో సహాయం చేస్తాము. మీరు మీ ఉత్పత్తులను ఆన్‌లైన్‌లో విక్రయించాలనుకుంటున్నారా?",
        goodbye: "మీ సమయానికి ధన్యవాదాలు. మీ రోజు శుభంగా ఉండాలి!",
        error: "క్షమించండి, సాంకేతిక సమస్య ఏర్పడింది. మీ సమయానికి ధన్యవాదాలు."
    }
};

function getLanguageConfig(language) {
    return languageConfig[language] || languageConfig.en;
}

function escapeXml(text) {
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

function buildGatherResponse(text, language) {
    const config = getLanguageConfig(language);

    if (!process.env.PUBLIC_URL) {
        throw new Error("PUBLIC_URL is missing from your .env file");
    }

    const processUrl = new URL(
        "/api/call/process",
        process.env.PUBLIC_URL
    ).toString();

    return `
<Response>
    <Gather
        input="speech"
        action="${escapeXml(processUrl)}"
        method="POST"
        speechTimeout="auto"
        language="${config.locale}"
    >
        <Say language="${config.locale}">${escapeXml(text)}</Say>
    </Gather>
    <Say language="${config.locale}">${escapeXml(config.goodbye)}</Say>
    <Hangup/>
</Response>`;
}

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

        createConversation(result.callSid, phoneNumber);

        return res.status(200).json(result);
    } catch (error) {
        console.error("Call route error:", error);

        return res.status(500).json({
            success: false,
            message: "Call route failed",
            error: error.message
        });
    }
});

router.post("/twiml", (req, res) => {
    try {
        console.log("Twilio requested TwiML");

        const callSid = req.body?.CallSid;

        if (!callSid) {
            return res.status(400).type("text/xml").send(`
<Response>
    <Say language="en-IN">Sorry, something went wrong with the call.</Say>
    <Hangup/>
</Response>`);
        }

        let conversation = getConversation(callSid);

        if (!conversation) {
            conversation = createConversation(
                callSid,
                req.body?.To
            );
        }

        const config = getLanguageConfig(conversation.language);

        addMessage(callSid, "assistant", config.greeting);

        res.type("text/xml");

        return res.send(
            buildGatherResponse(
                config.greeting,
                conversation.language
            )
        );
    } catch (error) {
        console.error("TwiML route error:", error);

        return res.status(500).type("text/xml").send(`
<Response>
    <Say language="en-IN">Sorry, something went wrong.</Say>
    <Hangup/>
</Response>`);
    }
});

router.post("/process", async (req, res) => {
    try {
        const speech = req.body?.SpeechResult || "";
        const callSid = req.body?.CallSid;

        console.log("Customer speech:", speech);
        console.log("Call SID:", callSid);

        if (!callSid) {
            return res.status(400).type("text/xml").send(`
<Response>
    <Say language="en-IN">Sorry, something went wrong with the call.</Say>
    <Hangup/>
</Response>`);
        }

        let conversation = getConversation(callSid);

        if (!conversation) {
            conversation = createConversation(
                callSid,
                req.body?.From
            );
        }

        if (!speech.trim()) {
            saveLead(conversation);

            const config = getLanguageConfig(conversation.language);
            return res.type("text/xml").send(`
<Response>
    <Say language="${config.locale}">${escapeXml(config.goodbye)}</Say>
    <Hangup/>
</Response>`);
        }

        const detectedLanguage = detectLanguage(
            speech,
            conversation.language
        );

        updateConversation(callSid, {
            language: detectedLanguage
        });

        conversation = getConversation(callSid);

        addMessage(callSid, "customer", speech);

        const response = await generateResponse(
            speech,
            conversation
        );

        console.log("Detected language:", conversation.language);
        console.log("AI response:", response);

        addMessage(callSid, "assistant", response);

        updateConversation(callSid, {
            lastUserMessage: speech,
            lastAssistantMessage: response
        });

        const classification = classifyLead(conversation);

        updateConversation(callSid, {
            leadScore: classification.score,
            leadStatus: classification.status
        });

        conversation = getConversation(callSid);

        saveLead(conversation);

        console.log("Lead classification:", classification);
        console.log("Lead saved successfully:", callSid);

        res.type("text/xml");

        return res.send(
            buildGatherResponse(
                response,
                conversation.language
            )
        );
    } catch (error) {
        console.error("Speech processing error:", error);

        return res.status(500).type("text/xml").send(`
<Response>
    <Say language="en-IN">I'm sorry, there was a technical problem. Thank you for your time.</Say>
    <Hangup/>
</Response>`);
    }
});

module.exports = router;
