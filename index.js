import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import morgan from 'morgan'
import boom from 'express-boom'
import config from './src/config'

// Routes
import { authRoute } from 'routes'

const app = express()

const PORT = process.env.PORT || 4000

// Connect to MongoDB
mongoose.connect(config.MONGO_URL, {
    useNewUrlParser: true
})
mongoose.connection.on('connected', () => {
    console.log('Mongoose is connected')
})
mongoose.connection.on('disconnected', () => {
    console.log('Mongoose is disconnected')
})
mongoose.connection.on('error', error => {
    console.log('Mongoose error', error)
})

// Middlewares
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(morgan('dev'))
app.use(boom())
// CORS
app.use((req, res, next) => {
    if (process.env.NODE_ENV !== 'production') {
        res.setHeader('Access-Control-Allow-Origin', '*')
    } else {
        res.setHeader('Access-Control-Allow-Origin', config.WEB_URL)
    }
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, OPTIONS, PUT, PATCH, DELETE'
    )
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-Requested-With, content-type, Authorization'
    )
    res.setHeader('Access-Control-Allow-Credentials', true)
    next()
})

// Routes
app.use('/auth', authRoute)

app.get('/', (req, res) => {
    res.json({
        message: "I'm working!"
    })
})

app.listen(PORT, () => {
    console.log('Server is running on port ' + PORT)
})
