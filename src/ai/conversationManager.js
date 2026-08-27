const { generateResponse } = require("../services/aiService");

const conversations = new Map();

const getResponse = async (callSid, userMessage) => {
    if (!conversations.has(callSid)) {
        conversations.set(callSid, []);
    }

    const history = conversations.get(callSid);

    // Store customer message
    history.push({
        role: "user",
        message: userMessage
    });

    // Generate AI response
    const aiResponse = await generateResponse(userMessage);

    // Store AI response
    history.push({
        role: "assistant",
        message: aiResponse
    });

    return aiResponse;
};

const clearConversation = (callSid) => {
    conversations.delete(callSid);
};

module.exports = {
    getResponse,
    clearConversation
};