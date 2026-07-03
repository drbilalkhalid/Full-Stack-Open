import { useState, useEffect } from 'react'
import axios from 'axios'
import Weather from './Weather'

const ShowCountry = ({ countryToShow }) => {
  const LanguagesList = Object.values(countryToShow.languages)
  const flagInfo = countryToShow.flags

  return (
    <div>
      <h1>{countryToShow.name.common}</h1>
      <p>Capital {countryToShow.capital}</p>
      <p>
        Area {countryToShow.area} km<sup>2</sup>
      </p>

      <h2>Languages</h2>
      <ul>
        {LanguagesList.map((lang) => (
          <li key={lang}>{lang}</li>
        ))}
      </ul>

      <img src={flagInfo.png} alt={flagInfo.alt} />

      <Weather
        capital={countryToShow.capital}
        capitalInfo={countryToShow.capitalInfo}
      />
    </div>
  )
}

const CountriesList = ({ countriesToShow, search, showChoosedCountry }) => {
  if (search === '') {
    return null
  }
  if (countriesToShow.length > 10) {
    return <p>Too many matches, specify another filter</p>
  }
  if (countriesToShow.length === 1) {
    return <ShowCountry countryToShow={countriesToShow[0]} />
  }
  return (
    <div>
      {countriesToShow.map((country) => (
        <p key={country.name.common}>
          {country.name.common}{' '}
          <button onClick={() => showChoosedCountry(country.name.common)}>
            show
          </button>
        </p>
      ))}
    </div>
  )
}

export default CountriesList