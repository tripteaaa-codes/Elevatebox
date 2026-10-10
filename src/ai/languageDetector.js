
function detectLanguage(text, currentLanguage = "en") {
    if (typeof text !== "string" || !text.trim()) {
        return currentLanguage;
    }

    if (/[\u0900-\u097F]/.test(text)) {
        return "hi";
    }

    if (/[\u0C00-\u0C7F]/.test(text)) {
        return "te";
    }

    const normalizedText = text.toLowerCase();

    const hindiWords = [
        "namaste", "namaskar", "mujhe", "chahiye",
        "hai", "hain", "mera", "meri", "karna", "bataiye"
    ];

    const teluguWords = [
        "namaskaram", "naaku", "kaavali", "kavali",
        "undi", "nenu", "meeru", "cheppandi",
        "kaadu", "chudandi", "cheyyandi"
    ];

    const words = normalizedText.match(/[a-z]+/g) || [];

    const hindiScore = words.filter(word =>
        hindiWords.includes(word)
    ).length;

    const teluguScore = words.filter(word =>
        teluguWords.includes(word)
    ).length;

    if (hindiScore > teluguScore && hindiScore > 0) {
        return "hi";
    }

    if (teluguScore > hindiScore && teluguScore > 0) {
        return "te";
    }

    return currentLanguage;
}

module.exports = { detectLanguage };
