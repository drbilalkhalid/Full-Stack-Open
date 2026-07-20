import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, blogs, setBlogs, currentUser, displayNotification }) => {
  const [detailView, setDetailView] = useState(false)

  const viewToggle = () => {
    setDetailView(!detailView)
  }

  const buttonLabel = () => (detailView ? 'hide' : 'view')

  const showToDelete = () => {
    if (blog.user?.username === undefined) {
      return { display: '' }
    }
    if (currentUser?.username !== blog.user?.username) {
      return { display: 'none' }
    }
  }

  const incrementLike = async () => {
    const updateLikes = { likes: blog.likes + 1 }
    const updatedObject = await blogService.update(blog.id, updateLikes)
    setBlogs(
      blogs.map((b) =>
        b.id === updatedObject.id ? updatedObject : b,
      ),
    )
  }

  const deleteBlog = async () => {
    if (window.confirm(`remove blog ${blog.title} by ${blog.author}`)) {
      try {
        await blogService.remove(blog.id)
        setBlogs(blogs.filter((b) => b.id !== blog.id))
        displayNotification(
          `Successfully deleted ${blog.title} by ${blog.author}`,
        )
      } catch (error) {
        displayNotification(`failed, ${error.response?.data?.error}`, true)
      }
    }
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  if (detailView) {
    return (
      <div style={blogStyle}>
        <div>
          {blog.title} <button onClick={viewToggle}>{buttonLabel()}</button>
        </div>
        <div>
          <a href={blog.url} target='_blank'>
            {blog.url}
          </a>
        </div>
        <div>
          likes: {blog.likes} <button onClick={incrementLike}>like</button>
        </div>
        <div>{blog.author}</div>
        <div>
          <button style={showToDelete()} onClick={deleteBlog}>
            delete
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}{' '}
      <button onClick={viewToggle}>{buttonLabel()}</button>
    </div>
  )
}

export default Blog
