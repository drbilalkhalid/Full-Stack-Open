const loginRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body
  if (!username || !password) {
    return response
      .status(400)
      .json({ error: 'username or password is missing' })
  }

  const user = await User.findOne({ username })
  if (!user) {
    return response.status(401).json({ error: 'username is not present' })
  }

  const auth = await bcrypt.compare(password, user.passwordHash)
  if (!auth) {
    return response.status(401).json({ error: 'wrong password' })
  }

  const payload = {
    username: user.username,
    id: user._id.toString()
  }
  const token = jwt.sign(payload, process.env.SECRET, { expiresIn: 60*60 })

  response.status(200).json({ token, username: user.username, name: user.name })

})

module.exports = loginRouter
