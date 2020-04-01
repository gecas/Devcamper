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
        for (let i = 1; i < 100; i++) {
            const response = await importAccommodations(i);
            let places = response.data.data.places;
            let placesToInsert = {};
            let placesToInsertArray = [];
            for (let k = 0; k <= places.length; k++) {
                // console.log(typeof places[k]);
                if (typeof places[k] === 'undefined') {
                    continue;
                }
                let itemId = places[k].id;
                let name = places[k].name;
                let name_suffix = places[k].name_suffix;
                let type = places[k].type;
                let classField = places[k].class;
                let bounding_box = places[k].bounding_box;
                let price = places[k].price === null ? 0 : places[k].price.price;
                let savings = places[k].price === null ? 0 : places[k].price.savings;
                let location = {};
                location.coordinates = [places[k].location.lng, places[k].location.lat];
                location.type = 'Point';
                let tag_keys = places[k].tag_keys;
                placesToInsert.itemId = itemId;
                placesToInsert.name = name;
                placesToInsert.class = classField;
                placesToInsert.name_suffix = name_suffix;
                placesToInsert.bounding_box = bounding_box;
                placesToInsert.type = type;
                placesToInsert.price = price;
                placesToInsert.savings = savings;
                placesToInsert.location = location;
                placesToInsert.tag_keys = tag_keys;
                await Accommodation.create(placesToInsert);
                // placesToInsertArray.push(placesToInsert);
            }
            // places.forEach(element => async () => {
            //
            // });

            // await Accommodation.create(placesToInsertArray);
            // console.log('places to insert', placesToInsert);

        }

        console.log('Data imported...'.green.inverse);
        process.exit();
    } catch (e) {
        console.error(e.message.red);
    }
};

// Read Json files
async function importAccommodations(cityId) {
    try {
        return axios.get(`https://api-cdn.sygictraveldata.com/v2.6/en/places/list?levels=poi&limit=1000&categories=sleeping&tags_not=Bar&parent=city:${cityId}`);
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