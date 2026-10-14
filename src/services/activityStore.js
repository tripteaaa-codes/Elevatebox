const fs = require("fs");
const path = require("path");

const dataDirectory = path.join(__dirname, "../../data");
const activitiesFile = path.join(dataDirectory, "activities.json");

function ensureStorage() {
    if (!fs.existsSync(dataDirectory)) {
        fs.mkdirSync(dataDirectory, { recursive: true });
    }

    if (!fs.existsSync(activitiesFile)) {
        fs.writeFileSync(activitiesFile, "[]", "utf8");
    }
}

function getAllActivities() {
    ensureStorage();

    try {
        return JSON.parse(fs.readFileSync(activitiesFile, "utf8"));
    } catch (error) {
        throw new Error(`Unable to read activities: ${error.message}`);
    }
}

function getActivitiesByLeadId(leadId) {
    return getAllActivities()
        .filter(activity => String(activity.leadId) === String(leadId))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function addActivity(leadId, type, description, metadata = {}) {
    ensureStorage();

    const activities = getAllActivities();

    const activity = {
        id: `activity-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        leadId,
        type,
        description: description.trim(),
        metadata,
        createdAt: new Date().toISOString()
    };

    activities.push(activity);

    fs.writeFileSync(
        activitiesFile,
        JSON.stringify(activities, null, 2),
        "utf8"
    );

    return activity;
}

module.exports = {
    getAllActivities,
    getActivitiesByLeadId,
    addActivity
};