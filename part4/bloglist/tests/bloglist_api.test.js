const supertest = require('supertest')
const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const app = require('../app')
const mongoose = require('mongoose')
const helper = require('./helper_test')
const Blog = require('../models/bloglist')

const api = supertest(app)

describe('when database have initial data (initialBlogs)', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  describe('testing Get requests and the data coming from', () => {
    test('bloglist app return correct amount of blogs in the JSON format', async () => {
      const blogs = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(blogs.body.length, helper.initialBlogs.length)
    })

    test('can get a specific blog with valid id', async () => {
      const allBlogs = await helper.allBlogsInDb()
      const blogToGet = allBlogs[0]
      const returnedBlog = await api
        .get(`/api/blogs/${blogToGet.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(returnedBlog.body.title, blogToGet.title)
    })
    test('expect 404 in case of non existent blog id', async () => {
      const nonExistentBlogId = '6a539b2eb5c80fab5515a28b'
      await api.get(`/api/blogs/${nonExistentBlogId}`).expect(404)
    })
    test('expect 400 in case of invalid id', async () => {
      const nonExistentBlogId = '6a539b2eb'
      await api.get(`/api/blogs/${nonExistentBlogId}`).expect(400)
    })

    test('blogLists unqiue identifer property is id note _id', async () => {
      const blogs = await helper.allBlogsInDb()

      for (let blog of blogs) {
        assert(Object.hasOwn(blog, 'id'))
      }
    })
  })

  describe('testing Post request and the data validation we send at /api/blogs', () => {
    test('post request correctly add one more blog to db', async () => {
      const newBlog = {
        title: 'Third blog',
        author: 'Alice Johnson',
        url: 'https://example.com/third-blog',
        likes: 3,
      }
      await api.post('/api/blogs', newBlog).send(newBlog).expect(201)

      const blogsAtEnd = await helper.allBlogsInDb()
      const newCreatedBlog = blogsAtEnd[blogsAtEnd.length - 1]

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
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
  })

  describe('testing Delete request and its intended behaviour', () => {
    test('correctly delete the resource when given a right id', async () => {
      const blogsAtStart = await helper.allBlogsInDb()
      const blogToDelete = blogsAtStart[0]
      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

      const blogsAtEnd = await helper.allBlogsInDb()
      assert.strictEqual(blogsAtStart.length - 1, blogsAtEnd.length)
    })

    test('when given a id of unavailable resource or already deleted expect 204', async () => {
      const unavailableBlogsId = '6a57be1a1d7bfc071a129b38'
      await api.delete(`/api/blogs/${unavailableBlogsId}`).expect(204)
    })

    test('when given a invalid id expect 400', async () => {
      const inavlidBlogsId = '23dsaf'
      await api.delete(`/api/blogs/${inavlidBlogsId}`).expect(400)
    })
  })

  describe('testing Put request to update likes', () => {
    test('given a valid id and likes property can correctly update a resource', async () => {
      const allBlogs = await helper.allBlogsInDb()
      const blogToUpdate = allBlogs[0]
      const newLikes = 9345
      const updatedBlog = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send({ likes: newLikes })
      assert.strictEqual(updatedBlog.body.likes, newLikes)

      assert.strictEqual(updatedBlog.body.title, blogToUpdate.title)
      assert.strictEqual(updatedBlog.body.author, blogToUpdate.author)
      assert.strictEqual(updatedBlog.body.url, blogToUpdate.url)
    })
    test('given a valid id and but missing likes property expect 400', async () => {
      const allBlogs = await helper.allBlogsInDb()
      const blogToUpdate = allBlogs[0]

      await api.put(`/api/blogs/${blogToUpdate.id}`).send({}).expect(400)
    })
    test('given a non existent id and with likes property expect 404', async () => {
      const nonExistentBlogId = '6a539b2eb5c80fab5515a28b'
      await api
        .put(`/api/blogs/${nonExistentBlogId}`)
        .send({ likes: 34532 })
        .expect(404)
    })
  })
})

after(async () => {
  mongoose.connection.close()
})
