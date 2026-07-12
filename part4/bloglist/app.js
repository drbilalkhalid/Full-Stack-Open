const express = require('express')
const middleware = require('./utils/middleware')
const blogRouter = require('./controllers/bloglists')
const mongoose = require('mongoose')
const logger = require('./utils/logger')
const config = require('./utils/config')

mongoose
  .connect(config.MONGODB_URI, { family: 4 })
  .then(() => {
    logger.info('connected with MongoDB')
  })
  .catch((error) =>
    logger.error('error connecting with MongoDB', error.message),
  )

const app = express()

app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/blogs', blogRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
