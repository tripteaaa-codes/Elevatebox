const conversations = new Map();

function createConversation(callSid, phoneNumber) {
    const conversation = {
        callSid,
        phoneNumber,

        language: "en",
        stage: "intro",

        businessType: null,
        productCount: null,
        budget: null,
        timeline: null,
        features: [],

        messages: [],

        leadScore: 0,
        leadStatus: "Cold",

        callbackRequested: false,
        callbackTime: null
    };

    conversations.set(callSid, conversation);

    return conversation;
}

function getConversation(callSid) {
    return conversations.get(callSid);
}

function updateConversation(callSid, updates) {
    const conversation = conversations.get(callSid);

    if(!conversation) {
        return null;
    }

    Object.assign(conversation, updates);

    return conversation;
}

function addMessage(callSid, role, text) {
    const conversation = conversations.get(callSid);

    if(!conversation) {
        return null;
    }

    conversation.messages.push({
        role,
        text,
        timestamp: new Date()
    });

    return conversation;
}

function deleteConversation(callSid) {
    conversations.delete(callSid);
}

module.exports = {
    createConversation,
    getConversation,
    updateConversation,
    addMessage,
    deleteConversation
};