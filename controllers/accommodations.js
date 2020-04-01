const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Accommodation = require('../models/Accommodation');
const geocoder = require('../utils/geocoder');
const path = require('path');

// @desc      Search accommodations
// @route     POST /api/v1/accommodations/search
// @access    Private
exports.textSearchAccommodations = asyncHandler(async (req, res, next) => {
   // const searchQuery = req.query.q;
    const searchQuery = req.body.q;
    const accommodations = await Accommodation.search(searchQuery);
    res.status(200).json({success: true, count: accommodations.length, data: accommodations});
});

// @desc      Search accommodations in bounding box
// @route     POST /api/v1/accommodations/coordinates
// @access    Private
exports.searchAccommodationsInBoundingBox = asyncHandler(async (req, res, next) => {
    //const bottomLeftCoordinates = req.query.bottomLeftCoordinates;
    //const upperRightCoordinates = req.query.upperRightCoordinates;

   // if (!bottomLeftCoordinates && !upperRightCoordinates) {
    //    return next(new ErrorResponse(`No valid coordinates provided for search`, 400));
   // }

    const accommodations = await Accommodation.find({
        location: {
            $geoWithin: {
                $box: [
                    [25.0245351, 54.5693374], [25.4815807, 54.83232]
                   // [-72, -72], [100, 100]
                ]
            }
        }
    });
    res.status(200).json({success: true, count: accommodations.length, data: accommodations });
});
