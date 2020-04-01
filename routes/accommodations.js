const express = require('express');

const {
    textSearchAccommodations,
    searchAccommodationsInBoundingBox,
} = require('../controllers/Accommodations');

const Accommodation = require('../models/Accommodation');
const advancedResults = require('../middleware/advancedResults');

// Include other resource routers
const router = express.Router();

router.route('/coordinates').get(searchAccommodationsInBoundingBox);
router.route('/search').post(textSearchAccommodations);

module.exports = router;