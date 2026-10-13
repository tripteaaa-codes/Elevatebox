const express = require("express");
const router = express.Router();

const {
    getAllLeads,
    updateLead
} = require("../services/leadStore");

router.get("/", (req, res) => {
    try {
        let leads = getAllLeads();
        const { status, search, callbackRequested } = req.query;

        if (status) {
            leads = leads.filter(
                lead => lead.leadStatus?.toLowerCase() === status.toLowerCase()
            );
        }

        if (search) {
            const query = search.toLowerCase();

            leads = leads.filter(lead =>
                (lead.businessType || "").toLowerCase().includes(query) ||
                (lead.phoneNumber || "").toLowerCase().includes(query) ||
                (lead.budget || "").toLowerCase().includes(query)
            );
        }

        if (callbackRequested === "true") {
            leads = leads.filter(lead => lead.callbackRequested === true);
        }

        return res.status(200).json({
            success: true,
            total: leads.length,
            leads
        });
    } catch (error) {
        console.error("Error retrieving leads:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to retrieve leads"
        });
    }
});

router.patch("/:id/callback", (req, res) => {
    try {
        const { callbackTime } = req.body;

        if (!callbackTime || typeof callbackTime !== "string") {
            return res.status(400).json({
                success: false,
                message: "Please provide a callback date and time"
            });
        }

        const parsedDate = new Date(callbackTime);

        if (Number.isNaN(parsedDate.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Invalid callback date and time"
            });
        }

        if (parsedDate <= new Date()) {
            return res.status(400).json({
                success: false,
                message: "Callback time must be in the future"
            });
        }

        const lead = updateLead(req.params.id, {
            callbackRequested: true,
            callbackTime: parsedDate.toISOString()
        });

        if (!lead) {
            return res.status(404).json({
                success: false,
                message: "Lead not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Callback scheduled successfully",
            lead
        });
    } catch (error) {
        console.error("Error scheduling callback:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to schedule callback"
        });
    }
});

router.delete("/:id/callback", (req, res) => {
    try {
        const lead = updateLead(req.params.id, {
            callbackRequested: false,
            callbackTime: null
        });

        if (!lead) {
            return res.status(404).json({
                success: false,
                message: "Lead not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Callback cancelled successfully",
            lead
        });
    } catch (error) {
        console.error("Error cancelling callback:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to cancel callback"
        });
    }
});

router.get("/:id", (req, res) => {
    try {
        const leads = getAllLeads();
        const lead = leads.find(item => item.id === req.params.id);

        if (!lead) {
            return res.status(404).json({
                success: false,
                message: "Lead not found"
            });
        }

        return res.status(200).json({
            success: true,
            lead
        });
    } catch (error) {
        console.error("Error retrieving lead:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to retrieve lead"
        });
    }
});

module.exports = router;