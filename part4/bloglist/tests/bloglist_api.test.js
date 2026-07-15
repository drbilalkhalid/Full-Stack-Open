const supertest = require('supertest')
const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const app = require('../app')
const mongoose = require('mongoose')
const Blog = require('../models/bloglist')

const api = supertest(app)

const testBlogs = [
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

beforeEach(async () => {
  await Blog.deleteMany({})

  await Blog.insertMany(testBlogs)
})

test('bloglist app return correct amount of blogs in the JSON format', async () => {
  const blogs = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(blogs.body.length, testBlogs.length)
})

test('blog post unqiue identifer property is id note _id', async () => {
  const blogs = await api.get('/api/blogs')

  for (let blog of blogs.body) {
    assert(Object.hasOwn(blog, 'id'))
  }
})

test('post request correctly add one more blog to db', async () => {
  const newBlog = {
    title: 'Third blog',
    author: 'Alice Johnson',
    url: 'https://example.com/third-blog',
    likes: 3,
  }
  await api.post('/api/blogs', newBlog).send(newBlog).expect(201)

  const blogsAtEnd = await api.get('/api/blogs')
  const newCreatedBlog = blogsAtEnd.body[blogsAtEnd.body.length - 1]

  assert.strictEqual(blogsAtEnd.body.length, testBlogs.length + 1)
  assert.strictEqual(newCreatedBlog.title, newBlog.title)
  assert.strictEqual(newCreatedBlog.author, newBlog.author)
  assert.strictEqual(newCreatedBlog.url, newBlog.url)
  assert.strictEqual(newCreatedBlog.likes, newBlog.likes)
  assert.strictEqual(newCreatedBlog.likes, newBlog.likes)
  assert(newCreatedBlog.id)
})

test('in case of non existent likes propetry it should default to 0', async () => {
  const newBlog = {
    title: 'Third blog',
    author: 'Alice Johnson',
    url: 'https://example.com/third-blog',
  }
  const responseBlog = await api
    .post('/api/blogs', newBlog)
    .send(newBlog)
    .expect(201)
  assert.strictEqual(responseBlog.body.likes, 0)
})

test('in case of missing title property it should return 400', async () => {
  const newBlog = {
    author: 'Alice Johnson',
    url: 'https://example.com/third-blog',
    likes: 43,
  }
  await api.post('/api/blogs', newBlog).send(newBlog).expect(400)
})
test('in case of missing url property it should return 400', async () => {
  const newBlog = {
    title: 'Ai race',
    author: 'Alice Johnson',
    likes: 43,
  }
  await api.post('/api/blogs', newBlog).send(newBlog).expect(400)
})

after(async () => {
  mongoose.connection.close()
})
