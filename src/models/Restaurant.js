const mongoose = require('mongoose')

const RestaurantSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    workingHours: {
        start: {
            type: Number,
            required: true,
            min: 0,
            max: 24
        },
        end: {
            type: Number,
            required: true,
            min: 0,
            max: 24
        }
    },
    address: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    kitchens: [{type: String}],
    photos: [{
        url: {
            type: String,
            required: true
        }
    }],
    comments: [{
        name: {
            type: String,
            required: true,
            trim: true
        },
        date: {
            type: Date,
            default: Date.now()
        },
        text: {
            type: String,
            required: true,
            trim: true
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        }
    }],
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5,
        default: 0
    }
})

RestaurantSchema.methods.addComments = async function (name, text, rating) {
    const restaurant = this
    const comment = {
        name: name,
        text: text,
        rating: rating
    }
    restaurant.comments = restaurant.comments.concat(comment)
    const sum = restaurant.comments.reduce((a, b) => a.rating + b.rating, 0)
    restaurant.rating = Math.round((sum / restaurant.comments.length) || 0);
    await restaurant.save()
    return comment
}

RestaurantSchema.methods.addPhoto = async function (url) {
    const restaurant = this
    console.log(restaurant)
    const object = {
        url: url
    }
    restaurant.photos = restaurant.photos.concat(object)
    await restaurant.save()
    return object
}

const Restaurant = mongoose.model('Restaurant', RestaurantSchema)
module.exports = Restaurant