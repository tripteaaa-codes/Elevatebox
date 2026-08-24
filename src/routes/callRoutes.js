const express = require("express");
const { placeCall } = require("../services/telephonyService");

const router = express.Router();

router.post("/start", async ( req, res) => {
    try {
        const { phoneNumber } = req.body || { };

        if (!phoneNumber) {
            return res.status(400).json({
                success: false,
                message: "Phone number is required"
            });
        }

        const result = await placeCall(phoneNumber);

        res.json(result);

    } catch (error) {
        console.error("Call route error:", error);

        res.status(500).json({
            sucess: false,
            message: "Unable to start call"
        });
    }
});

module.exports = router;