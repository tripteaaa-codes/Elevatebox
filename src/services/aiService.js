const generateResponse = async (userMessage, conversation = {}) => {
    console.log("AI received:", userMessage);

    if (!userMessage) {
        return "I'm sorry, I didn't hear you. Could you please repeat that?";
    }

    const message = userMessage.toLowerCase().trim();

    if (
        message.includes("bye") ||
        message.includes("goodbye") ||
        message.includes("not interested") ||
        message.includes("no thank")
    ) {
        conversation.leadStatus = "Cold";
        conversation.stage = "completed";

        return "No problem at all. Thank you for your time. Have a wonderful day!";
    }

    if (
        message.includes("hello") ||
        message.includes("hi") ||
        message.includes("namaste") ||
        message.includes("నమస్కారం")
    ) {
        return "Hello! I'm calling from ElevateBox. We help businesses build e-commerce websites. Are you currently looking to sell your products online?";
    }

    if (!conversation.businessType) {
        if (
            message.includes("clothes") ||
            message.includes("clothing") ||
            message.includes("dress") ||
            message.includes("fashion")
        ) {
            conversation.businessType = "Clothing/Fashion";
        } else if (
            message.includes("shoes") ||
            message.includes("footwear")
        ) {
            conversation.businessType = "Footwear";
        } else if (
            message.includes("jewellery") ||
            message.includes("jewelry")
        ) {
            conversation.businessType = "Jewellery";
        } else if (
            message.includes("food") ||
            message.includes("cake") ||
            message.includes("bakery")
        ) {
            conversation.businessType = "Food";
        } else if (
            message.includes("electronics") ||
            message.includes("mobile") ||
            message.includes("laptop")
        ) {
            conversation.businessType = "Electronics";
        } else if (
            message.includes("sell") ||
            message.includes("selling") ||
            message.includes("products")
        ) {
            conversation.businessType = userMessage;
        }

        if (conversation.businessType) {
            conversation.stage = "products";

            return "That's helpful. Roughly how many products would you like to have on the website initially?";
        }

        return "Absolutely. What kind of products do you sell?";
    }

    if (!conversation.productCount) {
        const numberMatch = message.match(/\d+/);

        if (numberMatch) {
            conversation.productCount = parseInt(numberMatch[0]);
        } else if (message.includes("hundred")) {
            conversation.productCount = "Around 100";
        } else if (message.includes("thousand")) {
            conversation.productCount = "1000+";
        } else if (
            message.includes("few") ||
            message.includes("some") ||
            message.includes("small")
        ) {
            conversation.productCount = "Small number of products";
        }

        if (conversation.productCount) {
            conversation.stage = "budget";

            return "Got it. Do you already have a budget in mind for the website?";
        }

        return "Roughly how many products are you planning to sell?";
    }

    if (!conversation.budget) {
        if (
            message.includes("lakh") ||
            message.includes("lakhs") ||
            message.includes("thousand") ||
            message.includes("rupee") ||
            message.includes("₹") ||
            message.includes("rs") ||
            message.includes("budget") ||
            message.includes("cost") ||
            message.includes("price") ||
            message.match(/\d+/)
        ) {
            conversation.budget = userMessage;
            conversation.stage = "timeline";

            return "Thanks, that's useful to know. When would you ideally like the website to be ready?";
        }

        return "Do you already have a budget range in mind for the website?";
    }

    if (!conversation.timeline) {
        if (
            message.includes("day") ||
            message.includes("days") ||
            message.includes("week") ||
            message.includes("weeks") ||
            message.includes("month") ||
            message.includes("months") ||
            message.includes("tomorrow") ||
            message.includes("soon") ||
            message.includes("year")
        ) {
            conversation.timeline = userMessage;
            conversation.stage = "features";

            return "Perfect. What features would be most important for you, such as online payments, a shopping cart, order tracking, or WhatsApp integration?";
        }

        return "And when would you ideally like the website to be ready?";
    }

    const detectedFeatures = [];

    if (
        message.includes("payment") ||
        message.includes("upi") ||
        message.includes("razorpay")
    ) {
        detectedFeatures.push("Online payments");
    }

    if (
        message.includes("cart") ||
        message.includes("shopping")
    ) {
        detectedFeatures.push("Shopping cart");
    }

    if (
        message.includes("order") ||
        message.includes("tracking")
    ) {
        detectedFeatures.push("Order tracking");
    }

    if (message.includes("whatsapp")) {
        detectedFeatures.push("WhatsApp integration");
    }

    if (
        message.includes("login") ||
        message.includes("account")
    ) {
        detectedFeatures.push("Customer accounts");
    }

    if (detectedFeatures.length > 0) {
        conversation.features.push(...detectedFeatures);

        conversation.features = [
            ...new Set(conversation.features)
        ];

        conversation.stage = "qualification";
        conversation.leadScore += 20;

        if (conversation.leadScore >= 70) {
            conversation.leadStatus = "Hot";
        } else if (conversation.leadScore >= 40) {
            conversation.leadStatus = "Warm";
        } else {
            conversation.leadStatus = "Cold";
        }

        return "That sounds good. We can build the store around those requirements. Would you like to discuss the next steps and get the project started?";
    }

    if (
        message.includes("interested") ||
        message.includes("yes") ||
        message.includes("let's do") ||
        message.includes("lets do") ||
        message.includes("start") ||
        message.includes("ready") ||
        message.includes("go ahead") ||
        message.includes("proceed")
    ) {
        conversation.leadScore += 30;

        if (conversation.leadScore >= 70) {
            conversation.leadStatus = "Hot";
        } else if (conversation.leadScore >= 40) {
            conversation.leadStatus = "Warm";
        } else {
            conversation.leadStatus = "Cold";
        }

        return "That's great to hear. Let me understand your requirements a little better so we can suggest the right e-commerce website for your business.";
    }

    return "I understand. Could you tell me a little more about what you're looking for in your online store?";
};

module.exports = {
    generateResponse
};

