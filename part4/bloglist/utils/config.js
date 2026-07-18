require('dotenv').config()

const PORT = process.env.PORT

let MONGODB_URI = process.env.MONGODB_URI

if (process.env.NODE_ENV === 'test') {
  MONGODB_URI = process.env.MONGODB_TEST_URI
} else if (process.env.NODE_ENV === 'development') {
  MONGODB_URI = process.env.MONGODB_DEV_URI
}

const config = { PORT, MONGODB_URI }

module.exports = config
