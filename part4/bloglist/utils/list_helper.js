const dummy = (blogs) => {
  console.log(blogs.length)
  return 1
}

const totalLikes = (blogs) => {
  const totalLikes = blogs.reduce((accu, blog) => {
    return accu + Number(blog.likes)
  }, 0)
  return totalLikes
}

const favouriteBlog = (blogs) => {
  if (blogs.length === 0) return null

  return blogs.reduce((best, blog) => (blog.likes > best.likes ? blog : best))
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const authorCounts = {}
  let topAuthor = { author: '', blogs: 0 }

  for (const blog of blogs) {
    const name = blog.author

    authorCounts[name] = (authorCounts[name] || 0) + 1

    if (authorCounts[name] > topAuthor.blogs) {
      topAuthor = { author: name, blogs: authorCounts[name] }
    }
  }
  return topAuthor
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  const authorCounts = {}
  let topAuthor = { author: '', likes: 0 }

  for (const blog of blogs) {
    const name = blog.author

    authorCounts[name] = (authorCounts[name] || 0) + blog.likes

    if (authorCounts[name] > topAuthor.likes) {
      topAuthor = { author: name, likes: authorCounts[name] }
    }
  }
  return topAuthor
}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes
}
