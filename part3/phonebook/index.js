const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')

const app = express()

app.use(express.static('dist'))

app.use(express.json())

// custom middleware
app.use((request, response, next) => {
  const originalSend = response.send

  response.send = function (body) {
    response.locals.toResponseBody = body
    return originalSend.call(this, body)
  }
  next()
})

morgan.token('response-body', (request, response) => {
  const body = response.locals.toResponseBody

  if (typeof body === 'object') {
    return JSON.stringify(body)
  }

  return body
})

app.use(morgan(':method :url :status :response-time ms :response-body'))


// Get requests handling
app.get('/api/persons', (request, response) => {
  Person.find({}).then((persons) => response.json(persons))
})

//(this is using modern async approach instead of raw promises. Reason to use both appraoches is to see side by side comparasion later i will shift to modern appraoch completely)
app.get('/api/persons/:id', async (request, response) => {
  const requestedId = request.params.id
  try {
    const person = await Person.findById(requestedId)

    if (!person) {
      return response.status(404).json({ error: 'Person Not Found' })
    }
    response.json(person)
  } catch (error) {
    console.log('error while featching person id:', error.message)
    response.status(400).json({ error: 'likely invalid id' })
  }
})

app.get('/info', (request, response) => {
  const date = Date()
  Person.countDocuments({}).then((noOfContacts) => {
    response.send(
      `<p>Phonebook has info for ${noOfContacts} people</p> <p>${date}</p>`,
    )
  })
})

//Delete requests
app.delete('/api/persons/:id', (request, response) => {
  const deleteRequestId = request.params.id

  Person.findByIdAndDelete(deleteRequestId)
    .then((deletedPerson) => response.status(204).end())
    .catch((error) => response.status(400).json({ error: 'invalid id' }))
})

//Post requests (this is as well using modern approach for async tasks)
app.post('/api/persons', async (request, response) => {
  const body = request.body
  try {
    if (!body.name || !body.number) {
      return response.status(400).json({
        error: 'name or number is missing',
      })
    }

    const person = new Person({
      name: body.name,
      number: body.number,
    })

    const savedResponse = await person.save()

    response.json(savedResponse)
  } catch (error) {
    console.log('error while adding person:', error.message)

    response.status(500).json({ error: 'cannot save person' })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`)
})
