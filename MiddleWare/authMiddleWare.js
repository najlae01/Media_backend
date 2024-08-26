import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()
const secret = process.env.Vercel_JWT_KEY

const authMiddleWare = async (req, res, next) => {
  try {
    console.log('HEADERS: ', req.headers)
    const token = req.headers.authorization?.split(' ')[1]
    console.log('Received token: ', token)

    if (token) {
      const decoded = jwt.verify(token, secret)
      req.body._id = decoded?._id
      next()
    } else {
      res.status(401).json({ message: 'Invalid token' })
    }
  } catch (error) {
    console.error('Authorization error:', error)
    res.status(401).json({ message: 'Unauthorized' })
  }
}

export default authMiddleWare
