const jwt = require('jsonwebtoken')
const User = require('../models/User')
const configs = require('../configs')

const userAuth = async (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '')
    try {
        const data = jwt.verify(token, configs.jwtSecret)
        const user = await User.findOne({_id: data._id, 'tokens.token': token})
        if (!user) {
            throw new Error()
        }
        req.user = user
        req.token = token
        next()
    } catch (error) {
        res.status(401).send({error: 'Not authorized to access this resource'})
    }
}

const adminAuth = async (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '')

    try {
        const data = jwt.verify(token, configs.jwtSecret)
        const user = await User.findOne({_id: data._id, 'tokens.token': token})
        if (!user) {
            throw new Error()
        }
        if (user.role !== "ADMIN") {
            return res.status(403).json({message: "Forbidden"});
        }
        req.user = user
        req.token = token
        next()
    } catch (error) {
        res.status(401).send({error: 'Not authorized to access this resource'})
    }
}

module.exports = {user: userAuth, admin: adminAuth}