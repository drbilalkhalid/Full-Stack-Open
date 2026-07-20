import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const setToken = (tok) => {
  token = tok
} 

const create = async (newObject) => {
  const response = await axios.post(
    baseUrl,
    newObject,
    {headers: { Authorization: `Bearer ${token}` }},
  )
  return response.data
}

const update = async (id, updateObject) => {
  const response = await axios.put(`${baseUrl}/${id}`, updateObject)
  return response.data
}

const remove = async (id) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  }
  const response = await axios.delete(`${baseUrl}/${id}`, config)
  return response.status
}

export default { getAll, create, update, remove, setToken }
