const express = require('express')
const Kitchen = require('../models/Kitchen')

const router = express.Router()

router.get('/kitchens', async (req, res) => {
    try {
        const kitchens = await Kitchen.find()
        res.status(200).send(kitchens)
    } catch (error) {
        res.status(400).send(error)
    }
})

module.exports = router

// "Американская",
// "Грузинская",
// "Європейська",
// "Китайська",
// "Океанічне меню",
// "Риба и морепродукти",
// "Славянська",
// "Українська",
// "Японська",
