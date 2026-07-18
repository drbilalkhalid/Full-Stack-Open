const supertest = require('supertest')
const app = require('../app')
const helper = require('./helper_test')
const { describe, test, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const User = require('../models/user')
const mongoose = require('mongoose')
const bycrpt = require('bcrypt')

const api = supertest(app)

describe('when database have inital users', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await User.insertMany(helper.initialUsers)
  })

  describe('Get requests testing users retrieval', () => {
    test('users are returned as json and with correct length', async () => {
      const response = await api
        .get('/api/users')
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(response.body.length, helper.initialUsers.length)
    })
    test('user object has correct properties', async () => {
      const response = await api.get('/api/users')
      const user = response.body[0]

      assert.strictEqual(user.username, helper.initialUsers[0].username)
      assert.strictEqual(user.name, helper.initialUsers[0].name)
      assert.ok(user.id)
      assert.ok(!user.passwordHash) //to confirm passwordHash is not returned in the response
    })
  })

  describe('Post requests testing user creation', () => {
    test('creating a new user with valid data', async () => {
      const newUser = {
        username: 'newuser',
        name: 'New User',
        password: 'newpassword',
      }
      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.allUsersInDb()
      assert.strictEqual(usersAtEnd.length, helper.initialUsers.length + 1)

      const usertoTest = usersAtEnd[usersAtEnd.length - 1]
      assert.strictEqual(usertoTest.username, newUser.username)
      assert.strictEqual(usertoTest.name, newUser.name)
      assert.ok(usertoTest.id)
      assert.ok(!usertoTest.passwordHash) //to confirm passwordHash is not returned in the response
    })

    test('creating a new user with missing username', async () => {
      const newUser = {
        name: 'New User',
        password: 'newpassword',
      }
      await api.post('/api/users').send(newUser).expect(400)

      const usersAtEnd = await helper.allUsersInDb()

      assert.strictEqual(usersAtEnd.length, helper.initialUsers.length)
    })

    test('creating a new user with with duplicate username', async () => {
      const newUser = {
        username: 'testuser1',
        name: 'New User',
        password: 'newpassword',
      }
      const response = await api.post('/api/users').send(newUser).expect(400)

      assert.ok(response.body.error.includes('username'))
      const usersAtEnd = await helper.allUsersInDb()
      assert.strictEqual(usersAtEnd.length, helper.initialUsers.length)
    })

    test('creating a new user with short username', async () => {
      const newUser = {
        username: 'ab',
        name: 'New User',
        password: 'newpassword',
      }
      const response = await api.post('/api/users').send(newUser).expect(400)

      assert.ok(response.body.error.includes('username'))
      const usersAtEnd = await helper.allUsersInDb()
      assert.strictEqual(usersAtEnd.length, helper.initialUsers.length)
    })

    test('creating a new user with missing password', async () => {
      const newUser = {
        username: 'newuser',
        name: 'New User',
      }
      const response = await api.post('/api/users').send(newUser).expect(400)

      assert.ok(response.body.error.includes('password'))
      const usersAtEnd = await helper.allUsersInDb()
      assert.strictEqual(usersAtEnd.length, helper.initialUsers.length)
    })

    test('creating a new user with short password', async () => {
      const newUser = {
        username: 'newuser',
        name: 'New User',
        password: 'ab',
      }
      const response = await api.post('/api/users').send(newUser).expect(400)

      assert.ok(response.body.error.includes('password'))
      const usersAtEnd = await helper.allUsersInDb()
      assert.strictEqual(usersAtEnd.length, helper.initialUsers.length)
    })
    test('creating a new user with missing username and password', async () => {
      const newUser = {
        name: 'New User',
      }
      await api.post('/api/users').send(newUser).expect(400)

      const usersAtEnd = await helper.allUsersInDb()
      assert.strictEqual(usersAtEnd.length, helper.initialUsers.length)
    })
    test('creating a new user with missing name to check if it default to anonymous', async () => {
      const newUser = {
        username: 'newuser',
        password: 'newpassword',
      }
      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.allUsersInDb()
      assert.strictEqual(usersAtEnd.length, helper.initialUsers.length + 1)

      const usertoTest = usersAtEnd[usersAtEnd.length - 1]
      assert.strictEqual(usertoTest.username, newUser.username)
      assert.strictEqual(usertoTest.name, 'anonymous')
      assert.ok(usertoTest.id)
      assert.ok(!usertoTest.passwordHash) //to confirm passwordHash is not returned in the response
    })

    test('password are correctly hashing and storing in db', async () => {
      const newUser = {
        username: 'newuser',
        name: 'New User',
        password: 'newpassword',
      }
      const response = await api.post('/api/users').send(newUser).expect(201)

      const createdUser = await User.findById(response.body.id)

      assert.ok(createdUser.passwordHash)

      assert.notStrictEqual(createdUser.passwordHash, newUser.password)

      const compare = await bycrpt.compare(
        newUser.password,
        createdUser.passwordHash,
      )
      assert.strictEqual(compare, true)
    })
  })
})
after(async () => {
  await mongoose.connection.close()
})
