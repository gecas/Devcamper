const mongoose = require('mongoose');
const slugify = require('slugify');
const geocoder = require('../utils/geocoder');

const AccommodationSchema = new mongoose.Schema({
    id: {
        type: String,
        required: [true, 'Please add id'],
        unique: true,
        trim: true,
        maxlength: [250, 'Id can not be more than 50 characters']
    },
    name: {
        type: String,
        required: [true, 'Please add name'],
        unique: true,
        trim: true,
        // maxlength: [250, 'Name can not be more than 50 characters']
    },
    name_suffix: {
        type: String,
        required: [true, 'Please add name suffix'],
        unique: true,
        trim: true,
        // maxlength: [250, 'Name suffix can not be more than 50 characters']
    },
    price: {
        type: Array,
        default: false
    },
    location: {
        // GeoJSON Point
        type: {
            type: String,
            enum: ['Point']
        },
        coordinates: {
            type: [Number],
            index: '2dsphere'
        }
    },
    loc: {
        // GeoJSON Point
        type: {
            type: String,
            enum: ['Point']
        },
        coordinates: {
            type: [Number],
            index: '2dsphere'
        }
    },
    tag_keys: {
        type: Array,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

AccommodationSchema.index({"$**": "text"});
AccommodationSchema.pre('save', async function (next) {
    this.loc = {
        type: 'Point',
        coordinates: [this.location.lng, this.location.lat],
    };
    this.location = {
        type: 'Point',
        coordinates: [this.location.lng, this.location.lat],
    };
    next();
});

module.exports = mongoose.model('Accommodation', AccommodationSchema);