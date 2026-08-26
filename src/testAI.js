const { generateResponse } = require("./services/aiService");

const test = async () => {
    console.log(
        await generateResponse("What does ElevateBox do?")
    );

    console.log(
        await generateResponse("How much does it cost?")
    );

    console.log(
        await generateResponse("Hello")
    );
};

test();