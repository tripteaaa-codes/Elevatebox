const generateResponse = async (userMessage, conversation = {}) => {
    console.log("AI received:", userMessage);

    if (!userMessage) {
        return "I'm sorry, I didn't hear you, Could you please repeat that?";
    }

    const message = userMessage.toLowerCase();

    if (
        message.includes("hello") ||
        message.includes("hi") ||
        message.includes("namaste") ||
        message.includes("నమస్కారం")
    ) {
        return "Hello! I'm calling from ElevateBox. We help businesses build e-commerce websites. Are you currently looking to sell your products online?";
    }

    if (
        message.includes("website") ||
        message.includes("web site") ||
        message.includes("online store") ||
        message.includes("ecommerce") ||
        message.includes("e-commerce")
    ) {
        if (!conversation.businessType) {
            return "Absolutely, What kind of products do you sell?";
        }

        if (!conversation.productCount) {
            return "Got it. Roughly how many products would you like to have on the website initially?";
        }

        if (!conversation.budget) {
            return "That sounds good. Do you already have a budget in mind for the website?";
        }

        if (!conversation.timeline) {
            return "And when would you ideally like the website to be ready?";
        }

        return "Great. Would you also need features such as online payments, a shopping cart, order tracking, or WhatsApp integration?";
    }

    if(
        message.includes("sell")||
        message.includes("selling") ||
        message.includes("clothes") ||
        message.includes("clothing") ||
        message.includes("shoes") ||
        message.includes("jewellery") ||
        message.includes("jewelry") ||
        message.includes("food") ||
        message.includes("electronics")
    ) {
        return "That's helpful. Approximately how many products do you plan to sell through the website?";
    }
    if (
        message.includes("budget") ||
        message.includes("price") ||
        message.includes("cost") ||
        message.includes("rupee") ||
        message.includes("thousand") ||
        message.includes("lakh")
    ) {
        return "Thanks for sharing that. And what timeline are you thinking about for launching the website?";
    }

    if (
        message.includes("week") ||
        message.includes("month") ||
        message.includes("tomorrow") ||
        message.includes("soon") ||
        message.includes("year")
    ) {
        return "Understood. What features are most important to you, such as online payments, WhatsApp, order tracking, or a shopping cart?";
    }

    if (
        message.includes("interested") ||
        message.includes("yes") ||
        message.includes("let's do") ||
        message.includes("lets do") ||
        message.includes("start") ||
        message.includes("ready")
    ) {
        return "That's great to hear. Let me understand your requirements a little better so we can suggest the right website for your business.";
    }

    if (
        message.includes("bye") ||
        message.includes("goodbye") ||
        message.includes("not interested")
    ) {
        return "Thank you for your time. Have a wonderful day!";
    }

    // Default
    return "I understand. Could you tell me a little more about what you're looking for in your online store?";
};

module.exports = {
    generateResponse
};