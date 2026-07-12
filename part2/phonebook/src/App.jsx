import { useState, useEffect } from 'react'
import personService from './services/persons'
import Notification from './components/Notification'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(null)

  //Getting data for the first time and set it to persons
  useEffect(() => {
    personService.getAll().then((initialPersons) => setPersons(initialPersons))
  }, [])

  //display persons based on filter state otherwise all person
  const displayPersons = filter
    ? persons.filter((person) =>
        person.name.toLowerCase().includes(filter.toLowerCase()),
      )
    : persons

  //helper functions
  const notify = (message, errortype = 'success') => {
    setNotification([message, errortype])

    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }
  const clearForm = () => {
    setNewName('')
    setNewNumber('')
  }
  const validateName = (name) => {
    if (!name) {
      return
    }
    const istrue = name.length >= 3 ? true : false
    if (!istrue) {
      notify(`${name} is less then 3 characters`, 'error')
    }
    return istrue
  }
  const validateNumber = (number) => {
    if (!number) {
      return
    }
    const istrue = /^\d{2,3}-\d{7,}$/.test(number)
    if (!istrue) {
      notify(
        `Wrong phone no format, right format is '23-3453452343' or '932-234345546'`,
        'error',
      )
    }
    return istrue
  }
  const addNewPerson = () => {
    if (!validateName(newName.trim())) {
      return
    }
    if (!validateNumber(newNumber.trim())) {
      return
    }
    personService
      .create({ name: newName.trim(), number: newNumber.trim() })
      .then((createdPerson) => {
        setPersons(persons.concat(createdPerson))
        clearForm()
        notify(`Added ${createdPerson.name}`, 'success')
      })
      .catch((error) => notify('failed to add new contact', 'error'))
  }
  const updatePersonNumber = () => {
    if (!validateNumber(newNumber.trim())) {
      return
    }
    const personToUpdate = persons.find(
      (p) => p.name.toLowerCase() === newName.trim().toLowerCase(),
    )
    const name = personToUpdate.name
    const id = personToUpdate.id

    const updateConfirmation = window.confirm(
      `${newName} is already added to the phonebook, replace the old number with the new one?`,
    )
    if (!updateConfirmation) {
      return
    }

    personService
      .update(id, { name: name, number: newNumber.trim() })
      .then((updatedPerson) => {
        setPersons(persons.map((p) => (p.id === id ? updatedPerson : p)))
        clearForm()
        notify(`Updated the number of ${updatedPerson.name}`, 'success')
      })
      .catch((error) => notify(`failed to update ${name} number`, 'error'))
  }

  //personform submit event handler that add or update a person
  const onAddPerson = (event) => {
    event.preventDefault()
    const personExist = persons.some(
      (p) => p.name.toLowerCase() === newName.trim().toLowerCase(),
    )

    //update person
    if (personExist) {
      updatePersonNumber()
      return
    }

    //adding new person in case of no new match
    addNewPerson()
  }

  //persons event handler for deleting a person
  const deletePerson = (id) => {
    const personToDelete = persons.find((person) => person.id === id)
    const sure = window.confirm(`Delete ${personToDelete.name}?`)
    if (!sure) {
      return
    }

    personService
      .remove(id)
      .then((deletedPerson) => {
        setPersons(persons.filter((p) => p.id !== id))
        notify(`${personToDelete.name} is deleted`, 'success')
      })
      .catch((error) =>
        notify(`failed to delete '${personToDelete.name}'`, 'error'),
      )
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification} />
      <Filter filter={filter} setFilter={setFilter} />

      <h2>add a new</h2>
      <PersonForm
        onAddPerson={onAddPerson}
        newName={newName}
        newNumber={newNumber}
        setNewName={setNewName}
        setNewNumber={setNewNumber}
      />

      <h2>Numbers</h2>
      <Persons displayPersons={displayPersons} deletePerson={deletePerson} />
    </div>
  )
}

export default App
