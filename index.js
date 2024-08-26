import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import path from 'path'
import AuthRoute from './Routes/AuthRoute.js'
import UserRoute from './Routes/UserRoute.js'
import PostRoute from './Routes/PostRoute.js'
import UploadRoute from './Routes/UploadRoute.js'

// Routes
const app = express()

//to serve images for public
// app.use(express.static('public'))
// app.use('/images', express.static('images'))
// Serve static files
const __dirname = path.dirname(new URL(import.meta.url).pathname)
app.use('/images', express.static(path.join(__dirname, 'public/images')))

//Middleware
app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.use(
  cors({
    origin: 'https://media-frontend-five.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
)

app.options('*', (req, res) => {
  res.header(
    'Access-Control-Allow-Origin',
    'https://media-frontend-five.vercel.app'
  )
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.header('Access-Control-Allow-Credentials', 'true')
  res.sendStatus(200)
})

dotenv.config()

mongoose
  .connect(process.env.Vercel_MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(process.env.Vercel_PORT, () =>
      console.log(`Listening at ${process.env.Vercel_PORT}`)
    )
  )
  .catch((error) => console.log(error))

// Usage of routes
app.use('/auth', AuthRoute)
app.use('/user', UserRoute)
app.use('/post', PostRoute)
app.use('/upload', UploadRoute)
