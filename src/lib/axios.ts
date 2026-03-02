// lib/axios.ts
import Axios from 'axios';

const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

axios.interceptors.request.use((config) => {
  // Getting and setting XSRF token in request headers
  // Using decodeURIComponent to handle special characters 
  config.headers['X-XSRF-TOKEN'] = decodeURIComponent(getCookie('XSRF-TOKEN'))
  return config
})

// Utility function to retrieve a cookie value by name
function getCookie(name: string): string {
  const cookies = document.cookie.split(';')
  for (const cookie of cookies) {
    const [key, value] = cookie.split('=')
    if (key.trim() === name)
      return value
  }
  return ''
}

export default axios;
