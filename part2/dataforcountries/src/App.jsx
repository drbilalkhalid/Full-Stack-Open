import { useState, useEffect } from 'react'
import axios from 'axios'
import CountriesList from './components/Countries'

function App() {
  const [value, setValue] = useState('')
  const [allCountriesData, setAllCountriesData] = useState(null)

  const countriesToShow = allCountriesData
    ? allCountriesData.filter((country) =>
        country.name.common.toLowerCase().includes(value.toLowerCase()),
      )
    : []

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then((response) => {
        setAllCountriesData(response.data)
      })
      .catch((error) => {
        alert("Can't get the data form the server")
      })
  }, [])

  const handleInputValue = (event) => {
    setValue(event.target.value)
  }

  const showChoosedCountry = (commonName) => {
    setValue(commonName)
  }

  const handleForm = (event) => {
    event.preventDefault()
  }

  return (
    <>
      <form onSubmit={handleForm}>
        find countries <input value={value} onChange={handleInputValue} />
      </form>

      <CountriesList
        countriesToShow={countriesToShow}
        search={value}
        showChoosedCountry={showChoosedCountry}
      />
    </>
  )
}

export default App
