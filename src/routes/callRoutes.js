const express = require("express");

const router = express.Router();

const { placeCall } = require("../services/telephonyService");

router.post("/start", async (req, res) => {
    try {
        const { phoneNumber } = req.body;

        console.log("Phone number received:", phoneNumber);

        if (!phoneNumber) {
            return res.status(400).json({
                success: false,
                message: "Phone number is required"
            });
        }

        const result = await placeCall(phoneNumber);

        console.log("placeCall result:", result);

        if (!result.success) {
            console.error("Call failed:", result);

            return res.status(500).json({
                success: false,
                message: result.message,
                error: result.error
            });
        }

        res.status(200).json(result);

    } catch (error) {
        console.error("========== CALL ERROR ==========");
        console.error(error);
        console.error("Message:", error.message);
        console.error("Code:", error.code);
        console.error("Stack:", error.stack);
        console.error("================================");

        res.status(500).json({
            success: false,
            message: "Failed to place call",
            error: error.message
        });
    }
});

module.exports = router;