const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

dotenv.config();

const test = async () => {
    try {
        await connectDB();
        const adminUser = await User.findOne({ role: { $in: ['admin', 'owner'] } });
        if (!adminUser) return console.log('No admin');

        const token = jwt.sign({ id: adminUser._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

        const form = new FormData();
        form.append('name', 'Test');
        form.append('description', 'Test desc');
        form.append('address', 'Test addr');
        fs.writeFileSync('dummy.jpg', 'fake image content');
        form.append('image', fs.createReadStream('dummy.jpg'));

        const res = await axios.post('https://cravecart-qm4q.onrender.com/api/restaurants', form, {
            headers: {
                ...form.getHeaders(),
                Authorization: `Bearer ${token}`
            }
        });
        console.log('Success:', res.data);
    } catch (error) {
        if (error.response) {
            console.log('Error status:', error.response.status);
            console.log('Error data:', String(error.response.data).substring(0, 500));
        } else {
            console.log('Error:', error.message);
        }
    } finally {
        if (fs.existsSync('dummy.jpg')) fs.unlinkSync('dummy.jpg');
        process.exit(0);
    }
};
test();
