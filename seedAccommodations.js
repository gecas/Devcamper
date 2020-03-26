const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config({
    path: './config/config.env'
});

// load models
const Accommodation = require('./models/Accommodation');

// connect to db
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});

// Import data into db
const importData = async () => {
    try {
        const response = await importAccommodations();
        let places = response.data.data.places;
        places.map(place => place.location = {});
        console.log('Data imported...'.green.inverse);
        await Accommodation.create(places);
        process.exit();
    } catch (e) {
        console.error(e.message.red);
    }
};
// Read Json files
async function importAccommodations() {
    try {
        return axios.get('https://api-cdn.sygictraveldata.com/v2.6/en/places/list?levels=poi&limit=1000&categories=sleeping&tags_not=Bar&parent=city:12');
    } catch (e) {
        return e.message;
    }
}

// Delete data
const deleteData = async () => {
    try {
        await Accommodation.deleteMany();
        // await Course.deleteMany();
        console.log('Data destroyed...'.red.inverse);
        process.exit();
    } catch (e) {
        console.error(e);
    }
};

if (process.argv[2] === '-i') {
    importData();
} else if (process.argv[2] === '-d') {
    deleteData();
}