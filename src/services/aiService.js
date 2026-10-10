const responses = {
    en: {
        repeat: "I'm sorry, I didn't hear you clearly. Could you please repeat that?",
        goodbye: "No problem at all. Thank you for your time. Have a wonderful day!",
        greeting: "Hello! I'm calling from ElevateBox. We help businesses build e-commerce websites. Are you currently looking to sell your products online?",
        business: "Absolutely. What kind of products do you sell?",
        products: "That's helpful. Roughly how many products would you like to have on the website initially?",
        askProducts: "Roughly how many products are you planning to sell?",
        budget: "Got it. Do you already have a budget in mind for the website?",
        askBudget: "Do you already have a budget range in mind for the website?",
        timeline: "Thanks, that's useful to know. When would you ideally like the website to be ready?",
        askTimeline: "When would you ideally like the website to be ready?",
        features: "Perfect. What features would be most important for you, such as online payments, a shopping cart, order tracking, or WhatsApp integration?",
        next: "That sounds good. We can build the store around those requirements. Would you like to discuss the next steps and get the project started?",
        interested: "That's great to hear. Let me understand your requirements a little better so we can suggest the right e-commerce website for your business.",
        fallback: "I understand. Could you tell me a little more about what you're looking for in your online store?"
    },
    hi: {
        repeat: "माफ़ कीजिए, आपकी बात स्पष्ट रूप से सुनाई नहीं दी। क्या आप दोबारा बता सकते हैं?",
        goodbye: "कोई बात नहीं। अपना समय देने के लिए धन्यवाद। आपका दिन शुभ हो!",
        greeting: "नमस्ते! मैं ElevateBox से बात कर रहा हूँ। हम व्यवसायों के लिए ई-कॉमर्स वेबसाइट बनाते हैं। क्या आप अपने उत्पाद ऑनलाइन बेचना चाहते हैं?",
        business: "बिल्कुल। आप किस तरह के उत्पाद बेचते हैं?",
        products: "बहुत अच्छा। शुरुआत में आप अपनी वेबसाइट पर लगभग कितने उत्पाद रखना चाहते हैं?",
        askProducts: "आप लगभग कितने उत्पाद ऑनलाइन बेचना चाहते हैं?",
        budget: "समझ गया। क्या आपने वेबसाइट के लिए कोई बजट तय किया है?",
        askBudget: "क्या आपके मन में वेबसाइट के लिए कोई बजट है?",
        timeline: "धन्यवाद। आप अपनी वेबसाइट कब तक तैयार करवाना चाहेंगे?",
        askTimeline: "आप अपनी वेबसाइट कब तक तैयार करवाना चाहेंगे?",
        features: "बहुत अच्छा। आपके लिए कौन-सी सुविधाएँ ज़रूरी हैं, जैसे ऑनलाइन पेमेंट, शॉपिंग कार्ट, ऑर्डर ट्रैकिंग या WhatsApp इंटीग्रेशन?",
        next: "बहुत अच्छा। हम आपकी ज़रूरतों के अनुसार ऑनलाइन स्टोर बना सकते हैं। क्या आप आगे की प्रक्रिया और प्रोजेक्ट शुरू करने के बारे में बात करना चाहेंगे?",
        interested: "यह जानकर अच्छा लगा। मैं आपकी ज़रूरतों को थोड़ा और समझना चाहूँगा ताकि आपके व्यवसाय के लिए सही ई-कॉमर्स वेबसाइट सुझा सकूँ।",
        fallback: "मैं समझ गया। क्या आप बता सकते हैं कि आप अपनी ऑनलाइन दुकान में और क्या चाहते हैं?"
    },
    te: {
        repeat: "క్షమించండి, మీ మాట స్పష్టంగా వినిపించలేదు. దయచేసి మళ్లీ చెప్పగలరా?",
        goodbye: "పర్వాలేదు. మీ సమయానికి ధన్యవాదాలు. మీ రోజు శుభంగా ఉండాలి!",
        greeting: "నమస్కారం! నేను ElevateBox నుండి మాట్లాడుతున్నాను. మేము వ్యాపారాల కోసం ఈ-కామర్స్ వెబ్‌సైట్‌లను రూపొందిస్తాము. మీరు మీ ఉత్పత్తులను ఆన్‌లైన్‌లో విక్రయించాలనుకుంటున్నారా?",
        business: "తప్పకుండా. మీరు ఎలాంటి ఉత్పత్తులను విక్రయిస్తారు?",
        products: "చాలా బాగుంది. ప్రారంభంలో మీ వెబ్‌సైట్‌లో సుమారుగా ఎన్ని ఉత్పత్తులు ఉండాలని అనుకుంటున్నారు?",
        askProducts: "మీరు సుమారుగా ఎన్ని ఉత్పత్తులను ఆన్‌లైన్‌లో విక్రయించాలనుకుంటున్నారు?",
        budget: "సరే. మీ వెబ్‌సైట్ కోసం ఏదైనా బడ్జెట్ నిర్ణయించారా?",
        askBudget: "మీ వెబ్‌సైట్ కోసం మీ మనసులో ఏదైనా బడ్జెట్ ఉందా?",
        timeline: "ధన్యవాదాలు. మీ వెబ్‌సైట్ ఎప్పటికి సిద్ధంగా ఉండాలని అనుకుంటున్నారు?",
        askTimeline: "మీ వెబ్‌సైట్ ఎప్పటికి సిద్ధంగా ఉండాలని అనుకుంటున్నారు?",
        features: "చాలా బాగుంది. ఆన్‌లైన్ చెల్లింపులు, షాపింగ్ కార్ట్, ఆర్డర్ ట్రాకింగ్ లేదా WhatsApp అనుసంధానం వంటి ఏ సదుపాయాలు మీకు ముఖ్యమైనవి?",
        next: "చాలా బాగుంది. మీ అవసరాలకు అనుగుణంగా ఆన్‌లైన్ స్టోర్‌ను రూపొందించగలము. తదుపరి దశల గురించి మాట్లాడి ప్రాజెక్ట్ ప్రారంభించాలనుకుంటున్నారా?",
        interested: "చాలా సంతోషం. మీ వ్యాపారానికి సరైన ఈ-కామర్స్ వెబ్‌సైట్‌ను సూచించడానికి మీ అవసరాలను మరింతగా తెలుసుకోవాలనుకుంటున్నాను.",
        fallback: "అర్థమైంది. మీ ఆన్‌లైన్ స్టోర్‌లో మీకు ఇంకా ఏమి కావాలో కొంచెం వివరంగా చెప్పగలరా?"
    }
};

function getResponseLanguage(conversation) {
    const language = conversation.language || "en";
    return responses[language] ? language : "en";
}

function generateResponse(userMessage, conversation = {}) {
    console.log("AI received:", userMessage);

    const language = getResponseLanguage(conversation);
    const reply = responses[language];

    if (typeof userMessage !== "string" || !userMessage.trim()) {
        return reply.repeat;
    }

    const message = userMessage.toLowerCase().trim();

    if (
        message.includes("bye") ||
        message.includes("goodbye") ||
        message.includes("not interested") ||
        message.includes("no thank") ||
        message.includes("रुचि नहीं") ||
        message.includes("వద్దు") ||
        message.includes("ధన్యవాదాలు వద్దు")
    ) {
        conversation.leadStatus = "Cold";
        conversation.stage = "completed";
        return reply.goodbye;
    }

    if (
        /\b(hello|hi|hey|namaste)\b/i.test(message) ||
        message.includes("నమస్కారం") ||
        message.includes("నమస్తే") ||
        message.includes("नमस्ते") ||
        message.includes("नमस्कार")
    ) {
        return reply.greeting;
    }

    if (!conversation.businessType) {
        if (
            message.includes("clothes") ||
            message.includes("clothing") ||
            message.includes("dress") ||
            message.includes("fashion") ||
            message.includes("कपड़े") ||
            message.includes("బట్టలు")
        ) {
            conversation.businessType = "Clothing/Fashion";
        } else if (
            message.includes("shoes") ||
            message.includes("footwear") ||
            message.includes("जूते") ||
            message.includes("చెప్పులు")
        ) {
            conversation.businessType = "Footwear";
        } else if (
            message.includes("jewellery") ||
            message.includes("jewelry") ||
            message.includes("आभूषण") ||
            message.includes("నగలు")
        ) {
            conversation.businessType = "Jewellery";
        } else if (
            message.includes("food") ||
            message.includes("cake") ||
            message.includes("bakery") ||
            message.includes("खाना") ||
            message.includes("ఆహారం")
        ) {
            conversation.businessType = "Food";
        } else if (
            message.includes("electronics") ||
            message.includes("mobile") ||
            message.includes("laptop") ||
            message.includes("इलेक्ट्रॉनिक्स") ||
            message.includes("ఎలక్ట్రానిక్స్")
        ) {
            conversation.businessType = "Electronics";
        } else if (
            message.includes("sell") ||
            message.includes("selling") ||
            message.includes("products") ||
            message.includes("बेचना") ||
            message.includes("అమ్ముతాను")
        ) {
            conversation.businessType = userMessage;
        }

        if (conversation.businessType) {
            conversation.stage = "products";
            return reply.products;
        }

        return reply.business;
    }

    if (!conversation.productCount) {
        const numberMatch = message.match(/\d+/);

        if (numberMatch) {
            conversation.productCount = parseInt(numberMatch[0], 10);
        } else if (
            message.includes("hundred") ||
            message.includes("सौ") ||
            message.includes("వంద")
        ) {
            conversation.productCount = "Around 100";
        } else if (
            message.includes("thousand") ||
            message.includes("हज़ार") ||
            message.includes("వెయ్యి")
        ) {
            conversation.productCount = "1000+";
        } else if (
            message.includes("few") ||
            message.includes("some") ||
            message.includes("small") ||
            message.includes("कुछ") ||
            message.includes("కొన్ని")
        ) {
            conversation.productCount = "Small number of products";
        }

        if (conversation.productCount) {
            conversation.stage = "budget";
            return reply.budget;
        }

        return reply.askProducts;
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
            message.includes("बजट") ||
            message.includes("रुपये") ||
            message.includes("బడ్జెట్") ||
            message.includes("రూపాయలు") ||
            /\d+/.test(message)
        ) {
            conversation.budget = userMessage;
            conversation.stage = "timeline";
            return reply.timeline;
        }

        return reply.askBudget;
    }

    if (!conversation.timeline) {
        const hasTimeline =
            /\b(day|days|week|weeks|month|months|year|years|tomorrow|soon|today)\b/i.test(message) ||
            /\b(within|by|in)\s+\w+/i.test(message) ||
            message.includes("दिन") ||
            message.includes("सप्ताह") ||
            message.includes("महीने") ||
            message.includes("कल") ||
            message.includes("రోజు") ||
            message.includes("వారం") ||
            message.includes("నెల") ||
            message.includes("రేపు");

        if (hasTimeline) {
            conversation.timeline = userMessage;
            conversation.stage = "features";
            return reply.features;
        }

        return reply.askTimeline;
    }

    const detectedFeatures = [];

    if (
        message.includes("payment") ||
        message.includes("upi") ||
        message.includes("razorpay") ||
        message.includes("भुगतान") ||
        message.includes("చెల్లింపులు")
    ) {
        detectedFeatures.push("Online payments");
    }

    if (
        message.includes("cart") ||
        message.includes("shopping") ||
        message.includes("कार्ट") ||
        message.includes("కార్ట్")
    ) {
        detectedFeatures.push("Shopping cart");
    }

    if (
        message.includes("order") ||
        message.includes("tracking") ||
        message.includes("ऑर्डर") ||
        message.includes("ఆర్డర్")
    ) {
        detectedFeatures.push("Order tracking");
    }

    if (message.includes("whatsapp")) {
        detectedFeatures.push("WhatsApp integration");
    }

    if (
        message.includes("login") ||
        message.includes("account") ||
        message.includes("खाता") ||
        message.includes("అకౌంట్")
    ) {
        detectedFeatures.push("Customer accounts");
    }

    if (detectedFeatures.length > 0) {
        conversation.features = conversation.features || [];
        conversation.features.push(...detectedFeatures);
        conversation.features = [...new Set(conversation.features)];
        conversation.stage = "qualification";
        conversation.leadScore = (conversation.leadScore || 0) + 20;

        if (conversation.leadScore >= 70) {
            conversation.leadStatus = "Hot";
        } else if (conversation.leadScore >= 40) {
            conversation.leadStatus = "Warm";
        } else {
            conversation.leadStatus = "Cold";
        }

        return reply.next;
    }

    if (
        message.includes("interested") ||
        message.includes("yes") ||
        message.includes("let's do") ||
        message.includes("lets do") ||
        message.includes("start") ||
        message.includes("ready") ||
        message.includes("go ahead") ||
        message.includes("proceed") ||
        message.includes("हाँ") ||
        message.includes("हां") ||
        message.includes("అవును")
    ) {
        conversation.leadScore = (conversation.leadScore || 0) + 50;

        if (conversation.leadScore >= 70) {
            conversation.leadStatus = "Hot";
        } else if (conversation.leadScore >= 40) {
            conversation.leadStatus = "Warm";
        } else {
            conversation.leadStatus = "Cold";
        }

        return reply.interested;
    }

    return reply.fallback;
}

module.exports = {
    generateResponse
};
