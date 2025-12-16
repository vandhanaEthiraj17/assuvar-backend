const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../src/models/User');
const connectDB = require('../src/config/db');

dotenv.config();

const createAdmin = async () => {
    try {
        await connectDB();

        const email = 'admin@assuvar.com';
        const password = 'password123';

        const userExists = await User.findOne({ email });

        if (userExists) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            userExists.password = hashedPassword;
            await userExists.save();
            console.log('Admin password reset successfully.');
            console.log('Email:', email);
            console.log('Password:', password);
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            await User.create({
                name: 'Super Admin',
                email,
                password: hashedPassword,
                phone: '0000000000',
                role: 'admin'
            });

            console.log('Admin user created successfully.');
            console.log('Email:', email);
            console.log('Password:', password);
        }
        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

createAdmin();
