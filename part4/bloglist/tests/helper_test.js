const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Blog = require('../models/bloglist')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'First blog',
    author: 'John Doe',
    url: 'https://example.com/first-blog',
    likes: 5,
  },
  {
    title: 'Second blog',
    author: 'Jane Smith',
    url: 'https://example.com/second-blog',
    likes: 12,
  },
]

const initialUsers = [
  {
    username: 'testuser1',
    name: 'Test User 1',
    passwordHash: 'dcyrpthash1'
  },
  {
    username: 'testuser2',
    name: 'Test User 2',
    passwordHash: 'dcyrpthash2'
  }
]

const allBlogsInDb = async () => {
  const allBlogs = await Blog.find({})
  return allBlogs.map(blog => blog.toJSON())
}

const allUsersInDb = async () => {
  const allUsers = await User.find({})
  return allUsers.map(user => user.toJSON())
}

const createUserAndGetToken = async () => {
  const passwordHash = await bcrypt.hash('testpassword', 10)
  const user = new User({
    username: 'testuser',
    name: 'Test User',
    passwordHash,
  })
  const savedUser = await user.save()

  const payload = {
    username: savedUser.username,
    id: savedUser._id.toString(),
  }
  const token = jwt.sign(payload, process.env.SECRET)

  return { user: savedUser, token }
}

module.exports = { initialBlogs, allBlogsInDb, initialUsers, allUsersInDb, createUserAndGetToken }