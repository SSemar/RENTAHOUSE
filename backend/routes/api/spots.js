const express = require('express');

const { Spot } = require('../../db/models'); 
const router = express.Router();


//! GET ALL spots
router.get('/', async (req, res, next) => {
    const spots = await Spot.findAll();

    const spotsInfo = spots.map(spot => ({
        id: spots.id,
        ownerId: spot.ownerId,
        address: spot.address,
        city: spot.city,
        state: spot.state,
        country: spot.country,
        lat: spot.lat,
        lng: spot.lng,
        name: spot.name,
        description: spot.description,
        price: spot.price,
        createdAt: spot.createdAt,
        updatedAT: spot.updatedAT,
        avgRating: null,
        previewImage: null,
    }));

return res.status(200).json({ Spots: spotsInfo })

});



module.exports = router;