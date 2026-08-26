const generateResponse = async (userMessage) => {
    console.log("AI received:", userMessage);

    if (!userMessage) {
        return "I'm sorry, I didn't hear you. Could you please repeat that?";
    }
                                                                                                          
    const message = userMessage.toLowerCase();

    if (message.includes("hello") || message.includes("hi")) {
        return "Hello! It's great to speak with you. How can I help you today?";
    }

    if (message.includes("elevatebox")) {
        return "ElevateBox is an AI powered sales assistant designed to help businesses communicate with customers automatically.";
    }

    if (message.includes("price") || message.includes("cost")) {
        return "I'd be happy to help you with pricing. Could you tell me which ElevateBox service you're interested in?";
    }

    if (message.includes("bye") || message.includes("goodbye")) {
        return "Thank you for speaking with me. Have a wonderful day!";
    }

    return "That's interesting. I'd be happy to help you with that. Could you tell me a little more?";
};

module.exports = {
    generateResponse
};