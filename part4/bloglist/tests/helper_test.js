const Blog = require('../models/bloglist')

const initialBlogs = [
  {
    title: 'First blog',
    author: 'John Doe',
    url: 'https://example.com/first-blog',
    likes: 5,
  },
  {
    title: 'Second blog',
    author: 'Jane Smith',
    url: 'https://example.com/second-blog',
    likes: 12,
  },
]

const allBlogsInDb = async () => {
  const allBlogs = await Blog.find({})
  return allBlogs.map(blog => blog.toJSON())
}

module.exports = { initialBlogs, allBlogsInDb }