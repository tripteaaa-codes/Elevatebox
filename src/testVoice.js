require("dotenv").config();

const https = require("https");
const { hostname } = require("os");

const sid = process.env.TWILIO_ACCOUNT_SID;
const token = process.env.TWILIO_AUTH_TOKEN;
console.log("SID:", sid);
console.log("Token length:", token?.length);
console.log("Token loaded:", !!token);

const auth = Buffer
    .from(`${sid}:${token}`)
    .toString("base64");

const options = {
    hostname: "api.twilio.com",
    path: `/2010-04-01/Accounts/${sid}.json`,
    method: "GET",
    headers: {
        Authorization: `Basic ${auth}`
    }
};

const req = https.request(options, (res) => {
    let data = "";

    res.on("data", chunk => {
        data += chunk;
    });

    res.on("end", () => {
        console.log("HTTPS STATUS:", res.statusCode);
        console.log("TWILIO RESPONSE", data);
    });
});

req.on("error", (error) => {
    console.log("REQUEST ERROR:", error.message);
});

req.end();
