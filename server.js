const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const colors = require('colors');
// Load env vars
dotenv.config({
    path: './config/config.env'
});

// Connect to database
connectDB();

// Route files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');

const app = express();

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Mount routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);

const PORT = process.env.PORT || 5000;

app.listen(
    PORT,
    console.log(`Server is running in ${process.env.NODE_ENV} mdoe on port ${PORT}`)
);