const axios = require('axios');
require('dotenv').config();

// NeverBounce V3 API credentials
const NEVERBOUNCE_API_USERNAME = process.env.NEVERBOUNCE_API_USERNAME;
const NEVERBOUNCE_API_SECRET_KEY = process.env.NEVERBOUNCE_API_SECRET_KEY;
const NEVERBOUNCE_API_URL = 'https://api.neverbounce.com/v3/single/check';

async function validateEmail(email) {
    try {
        const response = await axios.post(NEVERBOUNCE_API_URL, null, {
            params: {
                username: NEVERBOUNCE_API_USERNAME,
                key: NEVERBOUNCE_API_SECRET_KEY,
                email: email,
            }
        });

        // Check if the response status is successful
        if (response.status !== 200) {
            console.error(`API Error: Status Code ${response.status}`);
            return false;
        }

        const emailStatus = response.data.result;
        console.log('Email validation response:', response.data);

        // Check if the email is valid
        if (emailStatus === 'invalid' || emailStatus === 'unknown') {
            console.log('This email address is invalid or cannot be verified.');
            return false; // Invalid or unverified email
        }

        // Check for disposable or risky email addresses
        if (emailStatus === 'disposable') {
            console.log('Disposable email addresses are not allowed.');
            return false; // Disposable email address
        }

        if (emailStatus === 'risky') {
            console.log('This email address is risky or has suspicious activity.');
            return false; // Risky email address
        }

        // Return true for a valid email
        return true;

    } catch (error) {
        // Detailed error handling
        if (error.response) {
            // Server responded with an error
            console.error('Error response from NeverBounce API:', error.response.data);
        } else {
            // No response from the API, check network or connection issues
            console.error('Error validating email:', error.message);
        }
        return false; // In case of an error (e.g., API failure, network error)
    }
}

module.exports = { validateEmail };



