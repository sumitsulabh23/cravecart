const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const jwt = require('jsonwebtoken');
const fs = require('fs');

dotenv.config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        const adminUser = await User.findOne({ role: { $in: ['admin', 'owner'] } });
        if (adminUser) {
            const token = jwt.sign({ id: adminUser._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
            fs.writeFileSync('token.txt', token);
        } else {
            console.error("No admin user found");
        }
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
