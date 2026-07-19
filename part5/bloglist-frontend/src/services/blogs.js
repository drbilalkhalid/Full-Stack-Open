import axios from 'axios'
const baseUrl = '/api/blogs'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async (newObject, token) => {
  const response = await axios.post(
    baseUrl,
    newObject,
    {headers: { Authorization: `Bearer ${token}` }},
  )
  return response.data
}

export default { getAll, create }
