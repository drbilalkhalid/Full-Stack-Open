import { useState, useEffect } from 'react'
import personService from './services/persons'
import Message from './components/Message'

const Filter = (props) => {
  return (
    <p>
      filter shown with{' '}
      <input
        type='text'
        value={props.filter}
        onChange={props.handleInputFilter}
      />
    </p>
  )
}

const PersonForm = (props) => {
  return (
    <form onSubmit={props.addNewContact}>
      <div>
        name: <input value={props.newName} onChange={props.handleInputName} />
      </div>
      <div>
        number:{' '}
        <input value={props.newNumber} onChange={props.handleInputNumber} />
      </div>
      <div>
        <button type='submit'>add</button>
      </div>
    </form>
  )
}

const Persons = (props) => {
  return (
    <div>
      {props.topersons.map((person) => (
        <p key={person.id}>
          {person.name} {person.number}
          <button onClick={() => props.deleteContact(person.id)}>delete</button>
        </p>
      ))}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null)

  useEffect(() => {
    personService.getAll().then((initialPersons) => setPersons(initialPersons))
  }, [])

  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase()),
  )

  const topersons = filter ? filteredPersons : persons

  //submit event handler for adding new contact
  const addNewContact = (event) => {
    event.preventDefault()
    if (newName && newNumber) {
      const exist = persons.some(
        (person) =>
          person.name.trim().toLowerCase() === newName.trim().toLowerCase(),
      )
      if (exist) {
        const sure = window.confirm(
          `${newName} is already added to the phonebook, replace the old number with the new one?`,
        )
        if (sure) {
          const contactToUpdate = persons.find(
            (p) => p.name.trim().toLowerCase() === newName.trim().toLowerCase(),
          )

          const newObj = { ...contactToUpdate, number: newNumber }

          personService
            .update(contactToUpdate.id, newObj)
            .then((updatedContact) => {
              setPersons(
                persons.map((person) =>
                  person.id === contactToUpdate.id ? updatedContact : person,
                ),
              )
              setNewName('')
              setNewNumber('')
              setMessage(`Updated the number of ${updatedContact.name}`)

              setTimeout(() => {
                setMessage(null)
              }, 3000)
            })
            .catch((error) => {
              setPersons(persons.filter((p) => p.id !== contactToUpdate.id))
              setNewName('')
              setNewNumber('')
              
              setMessage([`Information of ${contactToUpdate.name} had already been removed from the server`, 1])
              setTimeout(() => {
                setMessage(null)
              }, 3000);
            })
        }
      } else {
        const newObj = {
          name: newName,
          number: newNumber,
        }
        personService.create(newObj).then((returnPerson) => {
          setPersons(persons.concat(returnPerson))
          setNewName('')
          setNewNumber('')
          setMessage(`Added ${returnPerson.name}`)

          setTimeout(() => {
            setMessage(null)
          }, 3000)
        })
      }
    }
  }

  //delete event handler for deleting a contact
  const deleteContact = (id) => {
    const contactToDelete = persons.find((person) => person.id === id)
    const sure = window.confirm(`Delete ${contactToDelete.name}?`)

    if (sure) {
      personService
        .remove(id)
        .then((deletedContact) => {
          setPersons(persons.filter((p) => p.id !== id))
        })
        .catch((error) => {
          alert(`'${contactToDelete.name}' is already deleted`)
          setPersons(persons.filter((p) => p.id !== id))
        })
    }
  }

  //Controlled Component (inputs handlers)
  const handleInputName = (event) => {
    setNewName(event.target.value)
  }
  const handleInputNumber = (event) => {
    setNewNumber(event.target.value)
  }
  const handleInputFilter = (event) => {
    setFilter(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>

      <Message msg={message} />

      <Filter filter={filter} handleInputFilter={handleInputFilter} />

      <h2>add a new</h2>

      <PersonForm
        addNewContact={addNewContact}
        newName={newName}
        handleInputName={handleInputName}
        newNumber={newNumber}
        handleInputNumber={handleInputNumber}
      />

      <h2>Numbers</h2>

      <Persons topersons={topersons} deleteContact={deleteContact} />
    </div>
  )
}

export default App
