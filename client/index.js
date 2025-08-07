import axios from 'axios';
import failedParticipations from './data/failed-participations.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../.env') });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputFilePath = path.join(__dirname, 'output', process.env.OUTPUT_LOG_FILENAME || 'result.log');

// Configuration from environment variables
const config = {
    serverUrl: process.env.SERVER_URL || 'http://localhost:3000',
    promotionEndpoint: process.env.PROMOTION_ENDPOINT || '/promotion',
    auth: {
        username: process.env.AUTH_USERNAME || 'admin',
        password: process.env.AUTH_PASSWORD || 'password123!'
    },
    requestDelay: parseInt(process.env.REQUEST_DELAY) || 2000
};

console.log('Starting to resend failed participations...');
console.log(`Number of failed participations: ${failedParticipations.length}`);

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function resendParticipations() {
    for (let i = 0; i < failedParticipations.length; i++) {
        const payload = failedParticipations[i];
        const requestConfig = {
            method: 'post',
            auth: {
                username: config.auth.username,
                password: config.auth.password
            },
            maxBodyLength: Infinity,
            url: `${config.serverUrl}${config.promotionEndpoint}`,
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify(payload),
        };

        let response;
        try {
            console.log(` Sending request ${i + 1}/${failedParticipations.length}`);
            response = await axios.request(requestConfig);
            console.log('\t✅ Success:', response.status);
        } catch (error) {
            response = error.response || {};
            console.error('\t❌ Failed:', response.status);
        }
        writeLog(payload, response);

        if (i < failedParticipations.length - 1) {
            console.log(`\tWaiting for ${config.requestDelay / 1000} seconds ...`);
            await sleep(config.requestDelay);
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