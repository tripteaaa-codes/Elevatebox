const express = require("express");
const router = express.Router();

const { getAllActivities } = require("../services/activityStore");

router.get("/", (req, res) => {
try {
const activities = getAllActivities();

    const summary = activities.reduce((result, activity) => {
        result[activity.type] = (result[activity.type] || 0) + 1;
        return result;
    }, {});

    res.status(200).json({
        success: true,
        totalActivities: activities.length,
        summary
    });
} catch (error) {
    console.error("Error retrieving activity analytics:", error.message);

    res.status(500).json({
        success: false,
        message: "Unable to retrieve activity analytics"
    });
}

});

module.exports = router;
