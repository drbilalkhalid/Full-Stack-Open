const userRouter = require('express').Router()
const bycrpt = require('bcrypt')
const User = require('../models/user')

userRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if (!username || username.length < 3) {
    return response.status(400).json({
      error:
        'username is missing or too short, Must be at least 3 character long',
    })
  }

  if (!password || password.length < 3) {
    return response.status(400).json({
      error:
        'password is missing or too short, Must be at least 3 character long',
    })
  }

  const passwordHash = await bycrpt.hash(password, 10)
  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()
  response.status(201).json(savedUser)
})

userRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('notes', { title: 1, author: 1, url: 1, likes: 1 })
  response.json(users)
})

module.exports = userRouter
