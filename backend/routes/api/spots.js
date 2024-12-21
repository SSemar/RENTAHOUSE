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




//! GET Spots owned by Current User
router.get('/current', async (req, res, next) => {
    try {
        const userId = req.user.id; 
        const spots = await Spot.findAll({ where: { ownerId: userId } });

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
    } catch (error) {
        next(error);
    }
});



//! GET Spot Details by ID
router.get('/:spotId', async (req, res, next) => {
    try {
        const { spotId } = req.params;
        const spot = await Spot.findByPk(spotId, {
            include: [
                { model: SpotImage, as: 'SpotImages' }, // Adjust based on your associations
            ],
        });

        if (!spot) {
            return res.status(404).json({ message: "Spot couldn't be found" });
        }

        const spotDetails = {
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
            avgStarRating: null, 
            numReviews: null, 
            SpotImages: spot.SpotImages.map(img => ({
                id: img.id,
                url: img.url,
                preview: img.preview,
            })),
        };

        return res.status(200).json(spotDetails);
    } catch (error) {
        next(error);
    }
});

//! POST Create a Spot
router.post('/', async (req, res, next) => {
    try {
        const { address, city, state, country, lat, lng, name, description, price } = req.body;
        const ownerId = req.user.id; // Assuming user ID is available from auth middleware

        const newSpot = await Spot.create({
            ownerId,
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price,
        });

        return res.status(201).json(newSpot);
    } catch (error) {
        next(error);
    }
});

//! POST Add an Image to a Spot
router.post('/:spotId/images', async (req, res, next) => {
    try {
        const { spotId } = req.params;
        const { url, preview } = req.body;

        const spot = await Spot.findByPk(spotId);
        if (!spot) {
            return res.status(404).json({ message: "Spot couldn't be found" });
        }

        const newImage = await SpotImage.create({ spotId, url, preview });
        return res.status(201).json(newImage);
    } catch (error) {
        next(error);
    }
});

//! PUT Edit a Spot
router.put('/:spotId', async (req, res, next) => {
    try {
        const { spotId } = req.params;
        const updates = req.body;

        const spot = await Spot.findByPk(spotId);
        if (!spot) {
            return res.status(404).json({ message: "Spot couldn't be found" });
        }

        await spot.update(updates);
        return res.status(200).json(spot);
    } catch (error) {
        next(error);
    }
});

//! DELETE a Spot
router.delete('/:spotId', async (req, res, next) => {
    try {
        const { spotId } = req.params;

        const spot = await Spot.findByPk(spotId);
        if (!spot) {
            return res.status(404).json({ message: "Spot couldn't be found" });
        }

        await spot.destroy();
        return res.status(200).json({ message: 'Successfully deleted' });
    } catch (error) {
        next(error);
    }
});


module.exports = router;