const express = require("express");
const router = express.Router();

const { getAllLeads } = require("../services/leadStore");
const {
    getActivitiesByLeadId,
    addActivity
} = require("../services/activityStore");

const allowedTypes = [
    "call",
    "follow-up",
    "status-change",
    "note",
    "email",
    "meeting"
];

router.post("/:leadId", (req, res) => {
    try {
        const { leadId } = req.params;
        const { type, description, metadata = {} } = req.body;

        const leadExists = getAllLeads().some(
            lead => String(lead.id) === String(leadId)
        );

        if (!leadExists) {
            return res.status(404).json({
                success: false,
                message: "Lead not found"
            });
        }

        if (
            typeof type !== "string" ||
            !allowedTypes.includes(type.trim().toLowerCase())
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid activity type",
                allowedTypes
            });
        }

        if (
            typeof description !== "string" ||
            !description.trim() ||
            description.trim().length > 2000
        ) {
            return res.status(400).json({
                success: false,
                message: "Description is required and must not exceed 2000 characters"
            });
        }

        if (
            metadata === null ||
            typeof metadata !== "object" ||
            Array.isArray(metadata)
        ) {
            return res.status(400).json({
                success: false,
                message: "Metadata must be a JSON object"
            });
        }

        const activity = addActivity(
            leadId,
            type.trim().toLowerCase(),
            description,
            metadata
        );

        return res.status(201).json({
            success: true,
            message: "Activity recorded successfully",
            activity
        });
    } catch (error) {
        console.error("Error recording activity:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to record activity"
        });
    }
});

router.get("/:leadId", (req, res) => {
    try {
        const { leadId } = req.params;

        const leadExists = getAllLeads().some(
            lead => String(lead.id) === String(leadId)
        );

        if (!leadExists) {
            return res.status(404).json({
                success: false,
                message: "Lead not found"
            });
        }

        const activities = getActivitiesByLeadId(leadId);

        return res.status(200).json({
            success: true,
            leadId,
            total: activities.length,
            activities
        });
    } catch (error) {
        console.error("Error retrieving activities:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to retrieve activities"
        });
    }
});

module.exports = router;