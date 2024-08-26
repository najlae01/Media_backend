import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import AuthRoute from './Routes/AuthRoute.js'
import UserRoute from './Routes/UserRoute.js'
import PostRoute from './Routes/PostRoute.js'
import UploadRoute from './Routes/UploadRoute.js'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Routes
const app = express()

//to serve images for public
// app.use(express.static('public'))
// app.use('/images', express.static('images'))

// Get the directory name from the module's URL
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Serve static files from the "public/images" directory
app.use('/images', express.static(join(__dirname, 'public/images')))

//Middleware
app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))

const allowedOrigins = [
  'http://localhost:3000',
  'https://media-frontend-five.vercel.app',
  'https://media-frontend-ymug.vercel.app',
]

app.use(
  cors({
    origin: function (origin, callback) {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
)

app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.header('Access-Control-Allow-Credentials', 'true')
  res.sendStatus(200)
})

dotenv.config()

mongoose.set('strictQuery', true)

mongoose
  .connect(process.env.NEXT_MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(process.env.NEXT_PORT, () =>
      console.log(`Listening at ${process.env.NEXT_PORT}`)
    )
  )
  .catch((error) => console.log(error))

// Usage of routes
app.use('/auth', AuthRoute)
app.use('/user', UserRoute)
app.use('/post', PostRoute)
app.use('/upload', UploadRoute)
