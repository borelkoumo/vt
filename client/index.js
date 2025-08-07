import axios from 'axios';
import failedParticipations from './data/failed-participations.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputFilePath = path.join(__dirname, 'output', 'result.log');

console.log('Starting to resend failed participations...');
console.log(`Number of failed participations: ${failedParticipations.length}`);

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function resendParticipations() {
    for (let i = 0; i < failedParticipations.length; i++) {
        const payload = failedParticipations[i];
        const config = {
            method: 'post',
            auth: {
                username: 'admin',
                password: 'password123'
            },
            maxBodyLength: Infinity,
            url: 'http://localhost:3000/promotion',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic Y3hmLWFjY291bnQtdXNlcjpZZGlETk1KUmE2YWVRTXMhSlY3YSFXKjY5UFMjOWVSJA=='
            },
            data: JSON.stringify(payload),
        };

        let response;
        try {
            console.log(` Sending request ${i + 1}/${failedParticipations.length}`);
            response = await axios.request(config);
            console.log('\t✅ Success:', response.status);
        } catch (error) {
            response = error.response || {};
            console.error('\t❌ Failed:', response.status);
        }
        writeLog(payload, response);

        if (i < failedParticipations.length - 1) {
            console.log(`\tWaiting for 2 seconds ...`);
            await sleep(2000);
        }
        console.log('\t━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    }
}

function writeLog(payload, response) {
    const logLine = formatResponse(payload, response);
    fs.appendFileSync(outputFilePath, JSON.stringify(logLine, null, 2) + '\n', 'utf8');
}

function formatResponse(payload, response) {
    const logLine = {
        timestamp: new Date().toISOString(),
        status: response.status,
    };

    if (response.status >= 200 && response.status < 300) {
        logLine.statusText = response.statusText;
        logLine.data = response.data;
    } else {
        logLine.statusText = response?.data?.errorCode || response.statusText;
        logLine.error = response.data || {};
    }

    logLine.payload = payload;

    return logLine;
}

await resendParticipations();
console.log('Log written to:', outputFilePath);