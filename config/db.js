const mongoose = require('mongoose');

const connectDB = async () => {
    const conn = await

    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
};

module.exports = connectDB;