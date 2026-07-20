import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import LoginService from './services/login'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import NewBlogForm from './components/NewBlogForm'
import Toggleable from './components/Toggleable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, SetNotification] = useState(null)

  useEffect(() => {
    const fetchBlogs = async () => {
      const blog = await blogService.getAll()
      setBlogs(blog)
    }
    fetchBlogs()
  }, [])

  const sortedBlogs = blogs.toSorted((a, b) => b.likes - a.likes)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('bloglistAppUser')
    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON)
      setUser(loggedUser)
      blogService.setToken(loggedUser.token)
    }
  }, [])

  const displayNotification = (message, error = false) => {
    SetNotification([message, error])
    setTimeout(() => {
      SetNotification(null)
    }, 5000)
  }

  const login = async (loginObject) => {
    try {
      const user = await LoginService.login(loginObject)
      window.localStorage.setItem('bloglistAppUser', JSON.stringify(user))
      setUser(user)
      blogService.setToken(user.token)
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

  const createNewBlog = async (blogObject) => {
    try {
      const newBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(newBlog))
      newBlogFormRef.current.toggleVisibility()
      displayNotification(
        `a new blog ${newBlog.title} by ${newBlog.author} added`,
      )
      return true
    } catch (error) {
      if (error.response?.status === 401) {
        displayNotification(
          'you are not allowed to add a new blog, please relogin',
          true,
        )
        window.localStorage.removeItem('bloglistAppUser')
        setUser(null)
      } else {
        const errorMessage = error.response?.data?.error
        displayNotification(`failed, ${errorMessage === undefined ? 'something went wrong' : errorMessage}`, true)
      }
    }
  }

  const newBlogFormRef = useRef()

  if (user === null) {
    return <LoginForm login={login} notification={notification} />
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

      <Toggleable buttonLabel='create new blog' ref={newBlogFormRef}>
        <NewBlogForm createNewBlog={createNewBlog} />
      </Toggleable>

      {sortedBlogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          blogs={blogs}
          setBlogs={setBlogs}
          currentUser={user}
          displayNotification={displayNotification}
        />
      ))}
    </div>
  )
}

export default App
