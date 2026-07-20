const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const requestLogger = (request, response, next) => {
  logger.info('Method', request.method)
  logger.info('Path', request.path)
  logger.info('Body', request.body)
  logger.info('---')
  next()
}

const tokenExtractor = async (request, response, next) => {
  const authHeader = request.get('authorization')
  request.token = authHeader && authHeader.split(' ')[1]
  next()
}

const userExtractor = async (request, response, next) => {
  const token = request.token
  if (!token) {
    return response.status(401).json({ error: 'jwt token required for auth' })
  }
  const userToVerify = jwt.verify(token, process.env.SECRET)
  const verifiedUser = await User.findById(userToVerify.id)

  if (!verifiedUser) {
    return response
      .status(401)
      .json({ error: 'user not found or token invalid' })
  }
  request.user = verifiedUser
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).json({ error: 'Unknown Endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).json({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (
    error.code === 11000 &&
    Object.keys(error.keyValue)[0] === 'username'
  ) {
    return response.status(400).json({ error: 'username is unavailable' })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'invalid token for auth' })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired, relogin',
    })
  }
  next(error)
}

module.exports = {
  requestLogger,
  errorHandler,
  unknownEndpoint,
  tokenExtractor,
  userExtractor,
}
