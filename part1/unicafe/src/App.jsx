import { useState } from 'react'

const Button = ({ onClick, text }) => <button onClick={onClick} >{text}</button>

const Heading = ({ text }) => <h1>{text}</h1>

const StatisticLine = ({ text, value }) => <tr><td>{text}</td><td>{value}</td></tr>

const Statistics = ({ good, neutral, bad }) => {
  const all = good + neutral + bad
  const average = Math.round((good * 1) + (neutral * 0) + (bad * -1) / all * 10) / 10
  const positivePercentage = Math.round((good/all * 100) * 10) / 10

  if (good === 0 && neutral === 0 && bad === 0) {
    return <p>No feedback given</p>
  }
  return (
      <table>
        <tbody>
          <StatisticLine text="good" value={good}/>
          <StatisticLine text="netural" value={neutral}/>
          <StatisticLine text="bad" value={bad}/>
          <StatisticLine text="all" value={all}/>
          <StatisticLine text="average" value={average}/>
          <StatisticLine text="positive" value={positivePercentage + " %"} />
        </tbody>
      </table>
  )
}




const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const updateGood = () => setGood(good + 1)
  const updateNeutral = () => setNeutral(neutral + 1)
  const updateBad = () => setBad(bad + 1)

  const all = good + neutral + bad

  return (
    <div>
      <Heading text="give feedback" />

      <Button onClick={updateGood} text="good" />
      <Button onClick={updateNeutral} text="neutral" />
      <Button onClick={updateBad} text="bad" />

      <Heading text="statistics" />

      <Statistics good={good} neutral={neutral} bad={bad} />

    </div>
  )
}

export default App