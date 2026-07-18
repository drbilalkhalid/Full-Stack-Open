const blogRouter = require('express').Router()
const Blog = require('../models/bloglist')
const User = require('../models/user')
const { userExtractor } = require('../utils/middleware')

blogRouter.get('/', async (request, response) => {
  const allBlogs = await Blog.find({}).populate('user', {
    username: 1,
    name: 1,
  })
  response.json(allBlogs)
})

blogRouter.get('/:id', async (request, response) => {
  const requestedBlog = await Blog.findById(request.params.id).populate(
    'user',
    {
      username: 1,
      name: 1,
    },
  )
  if (!requestedBlog) {
    return response.status(404).end()
  }
  response.json(requestedBlog)
})

blogRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body
  const verifiedUser = request.user

  body.user = verifiedUser._id
  const newBlog = new Blog(body)

  const returnedBlog = await newBlog.save()

  const updatedNotes = verifiedUser.notes.concat(returnedBlog.id)
  await User.findByIdAndUpdate(
    verifiedUser._id,
    { notes: updatedNotes },
    { validation: true },
  )
  response.status(201).json(returnedBlog)
})

blogRouter.delete('/:id', userExtractor, async (request, response) => {
  const verifiedUser = request.user

  const blogToDelete = await Blog.findById(request.params.id)
  if (!blogToDelete) {
    return response.status(204).end()
  }

  if (blogToDelete.user.toString() !== verifiedUser.id) {
    return response.status(401).json({
      error: 'not authorized to delete this blog because you didnt created it',
    })
  }
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
