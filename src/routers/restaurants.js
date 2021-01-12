const express = require('express')
const Restaurant = require('../models/Restaurant')
const auth = require('../middleware/auth')
const s3 = require('../utils/s3')

const router = express.Router()

router.get('/sign-s3', auth.admin, s3.generateSignedUrl)

router.post('/restaurant', auth.admin, async (req, res) => {
    try {
        console.log(req.body)
        const restaurant = new Restaurant(req.body)
        await restaurant.save()
        res.status(200).send(restaurant)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/restaurant/photo/:id', auth.admin, async (req, res) => {
    const restaurantId = req.params.id;
    try {
        const restaurant = await Restaurant.findById({_id: restaurantId})
        console.log(restaurant)
        const photo = await restaurant.addPhoto(req.body.url)
        res.status(200).send(photo)
    } catch (error) {
        res.status(400).send(error)
    }
})


router.get('/restaurants', async (req, res) => {
    try {
        const restaurants = await Restaurant.find()
        res.status(200).send(restaurants)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.get('/restaurants/:id', async (req, res) => {
    const restaurantId = req.params.id;
    try {
        const restaurant = await Restaurant.findById({_id: restaurantId})
        res.status(200).send(restaurant)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/restaurants/comment/:id', auth.user, async (req, res) => {
    const restaurantId = req.params.id;
    try {
        const restaurant = await Restaurant.findById({_id: restaurantId})
        const comment = await restaurant.addComments(req.body.name, req.body.description, req.body.rating)
        res.status(200).send(comment)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.get('/restaurants/name/:name', async (req, res) => {
    const restaurantName = req.params.name;
    try {
        const restaurants = await Restaurant.find({
            name: {
                '$regex': restaurantName, '$options': 'i'
            }
        })
        res.status(200).send(restaurants)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/restaurants/filter', async (req, res) => {
    const queryIsOpen = req.body.isOpen;
    const queryRating = req.body.rating;
    const queryKitchens = req.body.kitchens;
    try {
        const query = Restaurant.find();
        if (queryRating) {
            query.where('rating').equals(queryRating)
        }
        if (queryKitchens && queryKitchens.length) {
            query.where('kitchens').in(queryKitchens)
        }
        const restaurants = await query.exec();
        if (queryIsOpen) {
            const filtered = restaurants.filter(restaurant => {
                const hours = new Date().getHours();
                console.log(hours)
                return hours > restaurant.workingHours.start && hours < restaurant.workingHours.end
            })
            return res.status(200).send(filtered);
        }
        res.status(200).send(restaurants)
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
})

module.exports = router
