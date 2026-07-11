const Message = ({ msg }) => {
  if (!msg) {
    return null
  }
  const [ message, code ] = msg

  if (code === 'error') {
    return (
      <div className='errorMessage'>
        <p>{message}</p>
      </div>
    )
  }

  return (
      <div className='message'>
        <p>{message}</p>
      </div>
    )

}

export default Message
