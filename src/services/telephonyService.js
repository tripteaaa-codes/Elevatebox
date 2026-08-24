const placeCall = async (phoneNumber) => {
    try {
        console.log(`Attempting to call: ${phoneNumber}`);

        return {
            success: true,
            message: "Call request created",
            phoneNumber
        };
    } catch (error) {
        console.log("Telephony error:", error);

        return {
            success: false,
            message: "Failes to place call",
            error: error.message
        };
    }
};

module.exports = {
    placeCall
};