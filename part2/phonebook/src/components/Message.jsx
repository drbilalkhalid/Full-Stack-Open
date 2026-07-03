const Message = ({ msg }) => {
  if (!msg) {
    return null
  }
  if (typeof msg !== 'string' || msg.length > 1 || msg[1] === 1) {
    return (
      <div className='errorMessage'>
        <p>{msg[0]}</p>
      </div>
    )
  }

  return (
      <div className='message'>
        <p>{msg}</p>
      </div>
    )

}

export default Message
