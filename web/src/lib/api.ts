import axios from 'axios'

const baseURL = process.env.BASE_URL || 'http://localhost:5000'

const api = axios.create({
  baseURL,
  withCredentials: true,
})

export default api
