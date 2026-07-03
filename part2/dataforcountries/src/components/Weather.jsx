import { useState, useEffect } from 'react'
import axios from 'axios'
const API_KEY = import.meta.env.VITE_WEATHER_KEY

const Weather = ({ capital, capitalInfo }) => {
  const [data, setData] = useState(null)

  useEffect(() => {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${capitalInfo.latlng[0]}&lon=${capitalInfo.latlng[1]}&appid=${API_KEY}&units=metric`,
      )
      .then((response) => {
        setData(response.data)
      })
      .catch((error) => {
        console.log("Can't get weather data")
      })
  }, [capitalInfo])

  if (!data) {
    return null
  }

  return (
    <div>
      <h2>Weather in {capital}</h2>
      <p>Temperature {data.main.temp} Celsius</p>
      <img
        src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
        alt='weather icon'
      />
      <p>Wind {data.wind.speed} m/s</p>
    </div>
  )
}

export default Weather