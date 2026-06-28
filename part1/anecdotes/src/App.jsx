import { useState } from 'react'

const AnecdotesofDay = ({ anecdotes, votes, selected, updateVotes, nextAnedote }) => {  
  return (
    <div>
      <h1>Anectode of the day</h1>
      <p>{anecdotes[selected]}</p>
      <p>has {votes[selected]} votes</p>
      <button onClick={updateVotes}>vote</button>
      <button onClick={nextAnedote}>next anecdote</button> 
    </div>
  )
}

const Anecdotes = ({ anecdotes, votes, selected, updateVotes, nextAnedote }) => {
  const highestVotes = Math.max(...votes)
  const highestVotesIndex = votes.indexOf(highestVotes)

  if (highestVotes === votes[selected] && highestVotes > 0) {
    return <AnecdotesofDay anecdotes={anecdotes} votes={votes} selected={selected} updateVotes={updateVotes} nextAnedote={nextAnedote} />
  }

  return (
    <div>
      <AnecdotesofDay anecdotes={anecdotes} votes={votes} selected={selected} updateVotes={updateVotes} nextAnedote={nextAnedote} />
      <div>
        <h1>Anectode with most votes</h1>
        <p>{anecdotes[highestVotesIndex]}</p>
      </div>
    </div>
  )

}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
  const initialVotes = Array(anecdotes.length).fill(0)
  
  const randNum = () => {
    return Math.floor(Math.random() * anecdotes.length);
  }
  
  const [selected, setSelected] = useState(randNum())
  const [votes, setVotes] = useState(initialVotes)
  
  
  const nextAnedote = () => setSelected(randNum())
  
  const updateVotes = () => {
    const newVotes = [...votes]
    newVotes[selected] += 1
    setVotes(newVotes)
  }

  return (
    <div>
      <Anecdotes anecdotes={anecdotes} votes={votes} selected={selected} updateVotes={updateVotes} nextAnedote={nextAnedote} />
    </div>
  )
}

export default App