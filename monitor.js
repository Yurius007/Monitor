const axios = require('axios');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Configuration
const PING_URL = process.env.PING_URL || 'https://example.com'; // URL to ping
const INTERVAL = process.env.PING_INTERVAL || 10000; // Ping interval in ms (default: 10s)
const EMAIL_TO = process.env.ALERT_EMAIL; // Alert email address
const EMAIL_FROM = process.env.MAIL_ADDRESS; // Sender email
const MAIL_CONFIG = {
    service: 'gmail',
    auth: {
        user: process.env.MAIL_ADDRESS,
        pass: process.env.MAIL_PASS
    }
};

let serviceDown = false; // Track service state

// Create a nodemailer transporter
const transporter = nodemailer.createTransport(MAIL_CONFIG);

function getFormattedTimestamp() {
    return new Date().toLocaleString('en-GB', { 
        day: '2-digit', month: 'short', year: 'numeric', 
        hour: '2-digit', minute: '2-digit', second: '2-digit', 
        hour12: false 
    }).replace(',', '').replace(/(\d{2}) (\w{3}) (\d{4}) (\d{2}:\d{2}:\d{2})/, '[$1/$2/$3 $4]');
}

// Function to send an alert email
async function sendAlert(error) {
    try {
        await transporter.sendMail({
            from: EMAIL_FROM,
            to: EMAIL_TO,
            subject: 'Service Down Alert',
            html: `
                <h1 style="color: red;">Service Down Alert</h1>
                <p>The service at <strong>${PING_URL}</strong> is not responding.</p>
                <p><strong>Error:</strong> ${error.message}</p>
                <img src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExbXlpbDcza2hoazhtNGJtNzB6amtwZndrYzZwdWJnZ2IxeWZwZWtzbyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/kspVl6FzbdblOMKRmM/giphy.gif" alt="itsfine_gif">
                <p>${getFormattedTimestamp()}</p>
            `
        });
        console.log(`${getFormattedTimestamp()} - Alert email sent`);
    } catch (err) {
        console.error(`${getFormattedTimestamp()} - Error sending email:`, err.message);
    }
}

// Function to ping the endpoint
async function pingService() {
    try {
        await axios.get(PING_URL, { timeout: 5000 });
        console.log(`${getFormattedTimestamp()} - Service is up: ${PING_URL}`);
        serviceDown = false;
    } catch (error) {
        console.error(`${getFormattedTimestamp()} - Service down: ${error.message}`);
        if (!serviceDown) {
            sendAlert(error);
            serviceDown = true;
        }
    }
}

setInterval(pingService, INTERVAL);
console.log(`${getFormattedTimestamp()} - Started monitoring ${PING_URL} every ${INTERVAL / 1000} seconds`);