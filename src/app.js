const express = require('express')
const mongoose = require('mongoose')
const configs = require('./configs')
const userRouter = require('./routers/user')
const restaurantsRouter = require('./routers/restaurants')
const kitchenRouter = require('./routers/kitchen')
const cors = require('cors')
const port = 3000

const app = express()
app.use(cors())

app.use(express.json())
app.use(userRouter)
app.use(restaurantsRouter)
app.use(kitchenRouter)

//DB
mongoose.connect(configs.mongoURL, configs.mongoData).then(() => console.log('connected to the db')).catch((err) => console.log(err))

app.listen(port, () => {
    console.log(`Example apps listening at http://localhost:${port}`)
})
