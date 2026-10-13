const fs = require("fs");
const path = require("path");

const dataDirectory = path.join(__dirname, "../../data");
const leadsFile = path.join(dataDirectory, "leads.json");

function ensureStorage() {
    if (!fs.existsSync(dataDirectory)) {
        fs.mkdirSync(dataDirectory, { recursive: true });
    }

    if (!fs.existsSync(leadsFile)) {
        fs.writeFileSync(leadsFile, "[]", "utf8");
    }
}

function getAllLeads() {
    ensureStorage();

    try {
        return JSON.parse(fs.readFileSync(leadsFile, "utf8"));
    } catch (error) {
        throw new Error(`Unable to read leads: ${error.message}`);
    }
}

function saveLead(conversation) {
    ensureStorage();

    const leads = getAllLeads();
    const id = conversation.callSid || `lead-${Date.now()}`;

    const lead = {
        id,
        phoneNumber: conversation.phoneNumber || null,
        businessType: conversation.businessType || null,
        productCount: conversation.productCount ?? null,
        budget: conversation.budget || null,
        timeline: conversation.timeline || null,
        features: conversation.features || [],
        language: conversation.language || "en",
        leadScore: conversation.leadScore || 0,
        leadStatus: conversation.leadStatus || "Cold",
        callbackRequested: conversation.callbackRequested || false,
        callbackTime: conversation.callbackTime || null,
        createdAt: new Date().toISOString()
    };

    const existingIndex = leads.findIndex(item => item.id === id);

    if (existingIndex >= 0) {
        leads[existingIndex] = {
            ...leads[existingIndex],
            ...lead,
            createdAt: leads[existingIndex].createdAt
        };
    } else {
        leads.push(lead);
    }

    fs.writeFileSync(leadsFile, JSON.stringify(leads, null, 2), "utf8");

    return lead;
}

function updateLead(id, updates) {
    ensureStorage();

    const leads = getAllLeads();
    const index = leads.findIndex(lead => lead.id === id);

    if (index === -1) {
        return null;
    }

    leads[index] = {
        ...leads[index],
        ...updates,
        updatedAt: new Date().toISOString()
    };

    fs.writeFileSync(leadsFile, JSON.stringify(leads, null, 2), "utf8");

    return leads[index];
}

module.exports = {
    saveLead,
    getAllLeads,
    updateLead
};