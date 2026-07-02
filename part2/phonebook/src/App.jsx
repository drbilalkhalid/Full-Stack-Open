import { useState, useEffect } from 'react'
import axios from 'axios'

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
        <p key={person.name}>
          {person.name} {person.number}
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

  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then((response) => setPersons(response.data))
  }, [])

  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase()),
  )

  const topersons = filter ? filteredPersons : persons

  //submit event handler for adding new contact
  const addNewContact = () => {
    event.preventDefault()
    if (newName && newNumber) {
      const exist = persons.some(
        (person) =>
          person.name.trim().toLowerCase() === newName.trim().toLowerCase(),
      )
      if (exist) {
        alert(`${newName} is already added to the phonebook`)
      } else {
        const newObj = {
          name: newName,
          number: newNumber,
        }
        setPersons(persons.concat(newObj))
        setNewName('')
        setNewNumber('')
      }
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

      <Persons topersons={topersons} />
    </div>
  )
}

export default App
