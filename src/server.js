const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const leadRoutes = require("./routes/leadRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const activityRoutes = require("./routes/activityRoutes");

dotenv.config();

const app = express();

app.use(cors({
    origin: "http://localhost:5173"
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const callRoutes = require("./routes/callRoutes");

app.use("/api/call", callRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/activities", activityRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`ElevateBox AI server running on port ${PORT}`);
});