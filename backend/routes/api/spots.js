const express = require("express")
const { requireAuth } = require('../../utils/auth.js');
const { Spot, Review, User, ReviewImage } = require('../../db/models');
const { Model } = require("sequelize");
const { handleValidationErrors } = require("../../utils/validation.js");
const router = express.Router();
const { check } = require('express-validator');
/*
{
  "message": "Bad Request", // (or "Validation error" if generated by Sequelize),
  "errors": {
    "address": "Street address is required",
    "city": "City is required",
    "state": "State is required",
    "country": "Country is required",
    "lat": "Latitude must be within -90 and 90",
    "lng": "Longitude must be within -180 and 180",
    "name": "Name must be less than 50 characters",
    "description": "Description is required",
    "price": "Price per day must be a positive number"
  }
}
*/

const valSpot = [
    check('address')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Street address is required'),
    check('address')
        .exists({ checkFalsy: true })
        .isLength({ min: 2, max: 50 })
        .withMessage('Street must be bigger than 2 letters'),
    check('city')
        .exists({ checkFalsy: true })
        .withMessage('City is required.'),
    check('state')
        .exists({ checkFalsy: true })
        .withMessage('State is required.'),
    check('country')
        .exists({ checkFalsy: true })
        .withMessage('Country is required.'),
    check('lat')
        .exists({ checkFalsy: true })
        .withMessage('Latitud must be within -90 and 90.'),
    check('lng')
        .exists({ checkFalsy: true })
        .withMessage('Longitude must be within -180 and 180.'),
    check('name')
        .exists({ checkFalsy: true })
        .withMessage('Name must be less than 50 characters.'),
    check('descriptiion')
        .exists({ checkFalsy: true })
        .withMessage('Description is required.'),
    check('price')
        .exists({ checkFalsy: true })
        .withMessage('Price per day must be a positive number.'),
    handleValidationErrors
];

//CREATE A SPOT
router.post('/', valSpot, async (req, res, next) => {
    try {
        const { address, city, state, country, lat, lng, name, description, price } = req.body
        console.log(address, city, state, country, lat, lng, name, description, price)

        const newSpot = await Spot.create({
            ownerId: req.user.id,
            address, city, state, country, lat, lng, name, description, price
        });

        res.status(201);
        return res.json(newSpot);

    } catch (e) {
        next(e);
    }
});



//GET ALL REVIEWS BY A SPOT'S ID
router.get('/:spotId/reviews', async (req, res, next) => {
    try {
        const spotId = req.params.spotId
        const spot = await Spot.findByPk(spotId);

        if (spot === null) {

            const invalidError = new Error("Spot couldn't be found")
            invalidError.status = 404;
            throw invalidError
        }

        console.log(spot)
        const reviews = await Review.findAll({
            include: [{
                model: User,
                attributes: ["id", 'firstName', "lastName"]
            },
            {
                model: ReviewImage,
                attributes: ["id", 'url']
            }
            ],
            where: { spotId: spotId }
        });
        return res.json({ Reviews: reviews })

    } catch (e) {
        next(e);
    }
});

//GET ALL SPOTS
router.get('/', async (req, res, next) => {
    try {
        const spots = await Spot.findAll({
            attributes: ["id", "ownerId", "address", "city", "state", "country", "lat", "lng", "name", "description", "price", "createdAt", "updatedAt"],
        });
        
        return res.json({ spots })
    } catch (e) {
        next(e);
    }
}),


    //GET ALL SPOTS OWNED BY THE CURRENT USER  -----work in progress-----
    router.get('/current', async (req, res, next) => {
        try {
            const currUser = req.params.Id;
            const spots = await Spot.findAll({
                where: { ownerId: currUser }

            });
            return res.json({ Spots: spots });

        } catch (e) {
            next(e);
        }
    }),
    
    module.exports = router;