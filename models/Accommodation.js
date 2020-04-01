const mongoose = require('mongoose');
const geocoder = require('../utils/geocoder');

const AccommodationSchema = new mongoose.Schema({
    itemId: {
        type: String
    },
    name: {
        type: String
    },
    name_suffix: {
        type: String,
    },
    address: {
        type: String,
    },
    type: {
        type: String,
        default: '0.0'
    },
    class: {
        type: Object
    },
    bounding_box: {
        type: Object
    },
    price: {
        type: String,
        default: '0.0'
    },
    savings: {
        type: String,
        default: '0.0'
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
    tag_keys: {
        type: Array,
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

AccommodationSchema.statics = {
    searchPartial: function (q) {
        return this.find(
            {
                $or: [
                    {"name": new RegExp(q, "gi")},
                ],
                // $caseSensitive: false
            },
            {'score': {'$meta': "textScore"}}
        ).limit(750);
    },

    searchFull: function (q) {
        return this.find({
            $text: {$search: q, $caseSensitive: false}
        }, {'score': {'$meta': "textScore"}}).sort({score: {$meta: "textScore"}}).limit(750);
    },

    search: async function (q) {
        const searchFull = await this.searchFull(q);
        if (searchFull.length) {
            return searchFull;
        }
        const searchPartial = await this.searchPartial(q);
        searchPartial.concat(searchFull);
        return searchPartial;
    }
};

AccommodationSchema.index({"$**": "text"}, {
    weights: {
        name: 10,
        name_suffix: 9,
        tag_keys: 8
    },
});

module.exports = mongoose.model('Accommodation', AccommodationSchema);