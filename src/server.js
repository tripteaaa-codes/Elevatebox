const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const callRoutes = require("./routes/callRoutes");

app.use("/api/call", callRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`ElevateBox AI server running on port ${PORT}`);
});