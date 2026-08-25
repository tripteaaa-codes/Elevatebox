require("dotenv").config();
const twilio = require("twilio");

const sid = process.env.TWILIO_ACCOUNT_SID;
const token = process.env.TWILIO_AUTH_TOKEN;

console.log("SID starts with AC:", sid?.startsWith("AC"));
console.log("SID length:", sid?.length);
console.log("Token length:", token?.length);

const client = twilio(sid, token);

client.api.accounts(sid).fetch()
    .then(account => {
        console.log("TWILIO AUTHENTICATION WORKS");
        console.log("Account:", account.friendlyName);
    })
    .catch(error => {
        console.log("TWILIO AUTHENTICATION FAILED");
        console.log("Status:", error.status);
        console.log("Code:", error.code);
        console.log("Message:", error.message);
    });