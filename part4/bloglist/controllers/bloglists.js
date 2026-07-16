const blogRouter = require('express').Router()
const Blog = require('../models/bloglist')

blogRouter.get('/', async (request, response) => {
  const allBlogs = await Blog.find({})
  response.json(allBlogs)
})

blogRouter.get('/:id', async (request, response) => {
  const requestedBlog = await Blog.findById(request.params.id)
  if (!requestedBlog) {
    return response.status(404).end()
  }
  response.json(requestedBlog)
})

blogRouter.post('/', async (request, response) => {
  const body = request.body

  const newBlog = new Blog(body)

  const returnedBlog = await newBlog.save()
  response.status(201).json(returnedBlog)
})

blogRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)

  response.status(204).end()
})

//This can only update likes
blogRouter.put('/:id', async (request, response) => {
  if (request.body?.likes === undefined) {
    return response
      .status(400)
      .json({ error: 'Likes property is missing in request' })
  }

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { likes: request.body.likes },
    { returnDocument: 'after', runValidation: true },
  )

  if (!updatedBlog) {
    return response.status(404).end()
  }

  response.json(updatedBlog)
})

module.exports = blogRouter
