const express = require("express");
const router = express.Router();

const { getAllLeads } = require("../services/leadStore");

router.get("/", (req, res) => {
    try {
        const leads = getAllLeads();

        const totalLeads = leads.length;

        const hotLeads = leads.filter(
            lead => lead.leadStatus?.toLowerCase() === "hot"
        ).length;

        const warmLeads = leads.filter(
            lead => lead.leadStatus?.toLowerCase() === "warm"
        ).length;

        const coldLeads = leads.filter(
            lead => lead.leadStatus?.toLowerCase() === "cold"
        ).length;

        const callbackRequests = leads.filter(
            lead => lead.callbackRequested === true
        ).length;

        const totalScore = leads.reduce(
            (sum, lead) => sum + (Number(lead.leadScore) || 0),
            0
        );

        const averageLeadScore = totalLeads > 0
            ? Number((totalScore / totalLeads).toFixed(2))
            : 0;

        return res.status(200).json({
            success: true,
            analytics: {
                totalLeads,
                hotLeads,
                warmLeads,
                coldLeads,
                callbackRequests,
                averageLeadScore
            }
        });
    } catch (error) {
        console.error("Error generating analytics:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to generate lead analytics"
        });
    }
});

module.exports = router;