const blogRouter = require('express').Router()
const Blog = require('../models/bloglist')

blogRouter.get('/', (request, response, next) => {
  Blog.find({})
    .then((blogLists) => response.json(blogLists))
    .catch((error) => next(error))
})

blogRouter.post('/', (request, response, next) => {
  const body = request.body

  const newBlog = new Blog(body)
  newBlog
    .save()
    .then((savedBlogList) => response.json(savedBlogList))
    .catch((error) => next(error))
})

module.exports = blogRouter
