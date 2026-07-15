const blogRouter = require('express').Router()
const Blog = require('../models/bloglist')

blogRouter.get('/', async (request, response) => {
  const allBlogs = await Blog.find({})
  response.json(allBlogs)
})

blogRouter.post('/', async (request, response) => {
  const body = request.body

  const newBlog = new Blog(body)

  const returnedBlog = await newBlog.save()
  response.status(201).json(returnedBlog)
})

module.exports = blogRouter
