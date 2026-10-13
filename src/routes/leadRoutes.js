const express = require("express");
const router = express.Router();

const { getAllLeads, updateLead } = require("../services/leadStore");

router.get("/", (req, res) => {
    try {
        let leads = getAllLeads();

        const {
            status,
            search,
            callbackRequested,
            sortBy = "createdAt",
            order = "desc",
            page = "1",
            limit = "10"
        } = req.query;

        if (status) {
            leads = leads.filter(
                lead => lead.leadStatus?.toLowerCase() === status.toLowerCase()
            );
        }

        if (search) {
            const query = search.trim().toLowerCase();

            leads = leads.filter(lead =>
                (lead.businessType || "").toLowerCase().includes(query) ||
                (lead.phoneNumber || "").toLowerCase().includes(query) ||
                (lead.budget || "").toLowerCase().includes(query)
            );
        }

        if (callbackRequested === "true") {
            leads = leads.filter(lead => lead.callbackRequested === true);
        } else if (callbackRequested === "false") {
            leads = leads.filter(lead => lead.callbackRequested !== true);
        }

        const allowedSortFields = [
            "createdAt",
            "leadScore",
            "businessType"
        ];

        const allowedOrders = ["asc", "desc"];

        if (!allowedSortFields.includes(sortBy)) {
            return res.status(400).json({
                success: false,
                message: "Invalid sortBy field",
                allowedFields: allowedSortFields
            });
        }

        if (!allowedOrders.includes(order.toLowerCase())) {
            return res.status(400).json({
                success: false,
                message: "Order must be asc or desc"
            });
        }

        const pageNumber = Number(page);
        const pageSize = Number(limit);

        if (
            !Number.isInteger(pageNumber) ||
            !Number.isInteger(pageSize) ||
            pageNumber < 1 ||
            pageSize < 1 ||
            pageSize > 100
        ) {
            return res.status(400).json({
                success: false,
                message: "Page must be positive and limit must be between 1 and 100"
            });
        }

        const direction = order.toLowerCase() === "asc" ? 1 : -1;

        leads.sort((a, b) => {
            const first = a[sortBy];
            const second = b[sortBy];

            if (first == null && second == null) return 0;
            if (first == null) return 1;
            if (second == null) return -1;

            if (sortBy === "leadScore") {
                return (Number(first) - Number(second)) * direction;
            }

            return String(first).localeCompare(String(second)) * direction;
        });

        const total = leads.length;
        const totalPages = Math.ceil(total / pageSize);
        const startIndex = (pageNumber - 1) * pageSize;
        const paginatedLeads = leads.slice(
            startIndex,
            startIndex + pageSize
        );

        return res.status(200).json({
            success: true,
            total,
            page: pageNumber,
            limit: pageSize,
            totalPages,
            hasNextPage: pageNumber < totalPages,
            hasPreviousPage: pageNumber > 1,
            leads: paginatedLeads
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
        const { id } = req.params;
        const { callbackTime } = req.body;

        if (typeof callbackTime !== "string" || !callbackTime.trim()) {
            return res.status(400).json({
                success: false,
                message: "Callback time is required"
            });
        }

        const parsedDate = new Date(callbackTime);

        if (Number.isNaN(parsedDate.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Invalid callback date"
            });
        }

        if (parsedDate <= new Date()) {
            return res.status(400).json({
                success: false,
                message: "Callback time must be in the future"
            });
        }

        const updatedLead = updateLead(id, {
            callbackRequested: true,
            callbackTime: parsedDate.toISOString()
        });

        if (!updatedLead) {
            return res.status(404).json({
                success: false,
                message: "Lead not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Callback scheduled successfully",
            lead: updatedLead
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
        const { id } = req.params;

        const updatedLead = updateLead(id, {
            callbackRequested: false,
            callbackTime: null
        });

        if (!updatedLead) {
            return res.status(404).json({
                success: false,
                message: "Lead not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Callback cancelled successfully",
            lead: updatedLead
        });
    } catch (error) {
        console.error("Error cancelling callback:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to cancel callback"
        });
    }
});

router.patch("/:id/status", (req, res) => {
    try {
        const { id } = req.params;
        const { leadStatus } = req.body;

        const allowedStatuses = [
            "New",
            "Contacted",
            "Interested",
            "Converted",
            "Lost"
        ];

        if (typeof leadStatus !== "string") {
            return res.status(400).json({
                success: false,
                message: "Lead status is required"
            });
        }

        const normalizedStatus = allowedStatuses.find(
            status =>
                status.toLowerCase() === leadStatus.trim().toLowerCase()
        );

        if (!normalizedStatus) {
            return res.status(400).json({
                success: false,
                message: "Invalid lead status",
                allowedStatuses
            });
        }

        const updatedLead = updateLead(id, {
            leadStatus: normalizedStatus
        });

        if (!updatedLead) {
            return res.status(404).json({
                success: false,
                message: "Lead not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Lead status updated successfully",
            lead: updatedLead
        });
    } catch (error) {
        console.error("Error updating lead status:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to update lead status"
        });
    }
});

router.get("/:id", (req, res) => {
    try {
        const { id } = req.params;
        const leads = getAllLeads();

        const lead = leads.find(item => String(item.id) === String(id));

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