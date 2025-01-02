const express = require('express');
const router = express.Router();
const { Spot } = require('../../db/models/spot'); 

console.log(Spot);

//! GET ALL spots
router.get('/', async (req, res, next) => {
    const spots = await Spot.findAll()
        .catch(next);

    const spotsInfo = spots.map(spot => ({
        id: spot.id,
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
        updatedAt: spot.updatedAt,
        avgRating: null,
        previewImage: null,
    }));

    return res.status(200).json({ Spots: spotsInfo });
});

//! GET Spots owned by Current User
router.get('/current', async (req, res, next) => {
    const userId = req.user.id; 
    const spots = await Spot.findAll({ where: { ownerId: userId } })
        .catch(next);

    const spotsInfo = spots.map(spot => ({
        id: spot.id,
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
        updatedAt: spot.updatedAt,
        avgRating: null,
        previewImage: null,
    }));

    return res.status(200).json({ Spots: spotsInfo });
});

module.exports = router;