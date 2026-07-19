const Notification = ({ notification }) => {
  if (!notification) {
    return null
  }
  const [message, error] = notification

  const style = {
    color: error ? 'red' : 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }

  if (error) {
    return (
      <div style={style}>
        <p>{message}</p>
      </div>
    )
  }

  return (
    <div style={style}>
      <p>{message}</p>
    </div>
  )
}

export default Notification