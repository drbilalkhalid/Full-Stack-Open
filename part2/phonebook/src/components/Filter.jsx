const Filter = ({ filter, setFilter }) => {
  return (
    <p>
      filter shown with{' '}
      <input type='text' value={filter} onChange={(event) => setFilter(event.target.value)} />
    </p>
  )
}

export default Filter
