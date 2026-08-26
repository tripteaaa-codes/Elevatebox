const { Message } = require("twilio/lib/twiml/MessagingResponse");
const { generateRespose } = require("../services/aiService");
const { response } = require("express");

const conversations = new Map();

const getResponse = async(callSid, userMessage) => {
    if(!conversations.has(callSid)) {
        conversations.set(callSid, []);
    }

    const history = conversations.get(callSid);

    history.push({
        role: "assitant",
        Message: response
    });

    return response;
};

const clearConversation = (callSid) => {
    conversations.delete(callSid);
};

module.exports = {
    getResponse,
    clearConversation
};