const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const adminExists = await User.findOne({ email: 'admin@cravecart.com' });
        if (adminExists) {
            console.log('Admin user already exists');
            process.exit();
        }

        const admin = new User({
            name: 'System Admin',
            email: 'admin@cravecart.com',
            password: 'adminpassword123',
            role: 'admin'
        });

        await admin.save();
        console.log('Admin user created successfully!');
        console.log('Email: admin@cravecart.com');
        console.log('Password: adminpassword123');
        process.exit();
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
