
import axios from 'axios';
import { generateAccessToken } from './src/utils/generateToken.js';
import dotenv from 'dotenv';
dotenv.config();

async function testApi() {
    const user = { id: 1, role: 'super_admin', department: 'ICE' };
    const token = generateAccessToken(user);

    console.log('Testing Attendance Report API for Course 13...');
    try {
        const res = await axios.get('http://127.0.0.1:4000/api/attendance/report?courseId=13&semester=Spring%202025', {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('SUCCESS:', JSON.stringify(res.data, null, 2));
    } catch (err) {
        console.error('API FAILED with status:', err.response?.status);
        console.error('Data:', JSON.stringify(err.response?.data, null, 2));
    }
}

testApi();
