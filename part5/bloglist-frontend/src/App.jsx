import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import LoginService from './services/login'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import CreateNewBlog from './components/CreateNewBlog'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [user, setUser] = useState(null)
  const [notification, SetNotification] = useState(null)

  useEffect(() => {
    const fetchBlogs = async () => {
      const blog = await blogService.getAll()
      setBlogs(blog)
    }
    fetchBlogs()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('bloglistAppUser')
    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON)
      setUser(loggedUser)
    }
  }, [])

  const displayNotification = (message, error = false) => {
    SetNotification([message, error])
    setTimeout(() => {
      SetNotification(null)
    }, 5000)
  }

  const handleLoginForm = async (event) => {
    event.preventDefault()
    try {
      const user = await LoginService.login(username, password)
      window.localStorage.setItem('bloglistAppUser', JSON.stringify(user))
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (error) {
      if (error.response?.status === 401) {
        displayNotification('wrong username or password', true)
      } else {
        displayNotification(`Something went wrong, ${error.message}`, true)
      }
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('bloglistAppUser')
    setUser(null)
  }

  const handleCreateNewBlog = async (event) => {
    event.preventDefault()
    try {
      const newBlog = await blogService.create(
        { title, author, url },
        user.token,
      )
      setBlogs(blogs.concat(newBlog))
      setTitle('')
      setAuthor('')
      setUrl('')
      displayNotification(
        `a new blog ${newBlog.title} by ${newBlog.author} added`,
      )
    } catch (error) {
      if (error.response?.status === 401) {
        displayNotification(
          'you are not allowed to add a new blog, please relogin',
          true,
        )
        window.localStorage.removeItem('bloglistAppUser')
        setUser(null)
      } else {
        displayNotification(`Something went wrong, ${error.message}`, true)
      }
    }
  }

  if (user === null) {
    return (
      <LoginForm
        username={username}
        password={password}
        setUsername={setUsername}
        setPassword={setPassword}
        handleLoginForm={handleLoginForm}
        notification={notification}
      />
    )
  }
  return (
    <div>
      <h2>blogs</h2>

      <Notification notification={notification} />

      <p>
        {user.name} logged in{' '}
        <span>
          <button onClick={handleLogout}>logout</button>
        </span>{' '}
      </p>

      <CreateNewBlog
        handleCreateNewBlog={handleCreateNewBlog}
        title={title}
        setTitle={setTitle}
        author={author}
        setAuthor={setAuthor}
        url={url}
        setUrl={setUrl}
      />

      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  )
}

export default App
