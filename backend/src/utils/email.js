import axios from 'axios';

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

export const sendEmail = async ({ to, subject, html }) => {
    try {
        if (!BREVO_API_KEY || BREVO_API_KEY === 'your_brevo_api_key') {
            console.log('⚠️ Email sending skipped - Brevo API key not configured');
            console.log(`Would send email to: ${to}`);
            console.log(`Subject: ${subject}`);
            return { success: true, message: 'Email skipped (dev mode)' };
        }

        const response = await axios.post(
            BREVO_API_URL,
            {
                sender: {
                    name: 'BAUET IMS',
                    email: 'noreply@bauet.edu'
                },
                to: [{ email: to }],
                subject,
                htmlContent: html
            },
            {
                headers: {
                    'api-key': BREVO_API_KEY,
                    'Content-Type': 'application/json'
                }
            }
        );

        return { success: true, messageId: response.data.messageId };
    } catch (error) {
        console.error('Email sending failed:', error.response?.data || error.message);
        throw new Error('Failed to send email');
    }
};
