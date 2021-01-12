const mongoose = require('mongoose')

const KitchenSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    }
})

const Kitchen = mongoose.model('Kitchen', KitchenSchema)
module.exports = Kitchen