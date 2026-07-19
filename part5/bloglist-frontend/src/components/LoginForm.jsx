import Notification from "./Notification"

const LoginForm = ({
  username,
  password,
  setUsername,
  setPassword,
  handleLoginForm,
  notification
}) => {
  return (
    <div>
      <h2>Login in to application</h2>
      <Notification notification={notification} />
      <form onSubmit={handleLoginForm}>
        <div>
          <label>
            username{' '}
            <input
              type='text'
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            password{' '}
            <input
              type='text'
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  )
}

export default LoginForm
