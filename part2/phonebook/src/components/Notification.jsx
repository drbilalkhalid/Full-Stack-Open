const Notification = ({ notification }) => {
  if (!notification) {
    return null
  }
  const [message, code] = notification

  const isError = code === 'error' ? true : false
  const style = {
    color: isError ? 'red' : 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }

  if (code === 'error') {
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
