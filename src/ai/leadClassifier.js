function classifyLead(conversation) {
    let score = 0;

    if (conversation.businessType) {
        score += 15;
    }

    if (conversation.productCount) {
        score += 15;
    }

    if (conversation.budget) {
        score += 20;
    }

    if (conversation.timeline) {
        score += 20;
    }

    if (conversation.features && conversation.features.length > 0) {
        score += 15;
    }

    if (conversation.callbackRequested) {
        score += 10;
    }

    if (conversation.lastUserMessage) {
        const message = conversation.lastUserMessage.toLowerCase();

        if (
            message.includes("ready") ||
            message.includes("start") ||
            message.includes("proceed") ||
            message.includes("go head") ||
            message.includes("interested") ||
            message.includes("yes")
        ) {
            score += 15;
        }

        if (
            message.includes("not interested") ||
            message.includes("no") ||
            message.includes("don't need") ||
            message.includes("do not need")
        ) {
            score += 20;
        }
    }

    let status = "Cold";

    if (score >= 70) {
        status = "Hot";
    } else if (score >= 40) {
        status = "Warm";
    }

    return {
        score,
        status
    };
}

module.exports = {
    classifyLead
};