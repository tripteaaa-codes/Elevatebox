const express = require("express");
const cors = require("cors");
require("dotenv").config();

const callRoutes = require("./routes/callRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "ElevateBox AI Sales Agent is running"
    });
});

app.use("/api/call", callRoutes);

app.listen(PORT, () => {
    console.log(`ElevateBox AI server running on port ${PORT}`);
});
