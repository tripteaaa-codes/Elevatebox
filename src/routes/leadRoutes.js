const express = require("express");
const router = express.Router();
const { getAllLeads } = require("../services/leadStore");

router.get("/", (req, res) => {
    try {
        let leads = getAllLeads();

        const { status, search }  = req.query;

        if(status) {
            leads = leads.filter(
                lead => lead.leadStatus?.toLowerCase() === status.toLowerCase()
            );
        }
         if(search) {
            const query = search.toLowerCase();

            leads = leads.filter(lead =>
                (lead.businessType || "").toLowerCase().includes(query) ||
                (lead.phoneNumber || "").toLowerCase().includes(query) ||
                (lead.budget || "").toLowerCase().includes(query) 
            );
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
            message: "Unable to retrieve leads",
        });
    }
});

router.get("/:id", (req, res) => {
    try {
        const leads = getAllLeads();

        const lead = leads.find(
            item => item.id === req.params.id
        );

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
            message: "Unable to retrieve lead",
        });
    }
});

module.exports = router;