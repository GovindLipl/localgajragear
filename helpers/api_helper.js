//nvm install v18.15.0
import axios from "axios"
const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api`
import { getAuthToken } from "./authHelper"
const axiosApi = axios.create({
  baseURL: API_URL,
})
axiosApi.interceptors.request.use(async function (config) {
  const token = await getAuthToken();
  config.headers.Authorization = `Bearer ${JSON.parse(token)}`;
  return config;
});

axiosApi.interceptors.response.use(
  response => response,
  error => Promise.reject(error)
)

export async function get(url, config = {}) {
  return await axiosApi.get(url, { ...config }).then(response => response.data)
}

export async function post(url, data, config = {}) {
  return axiosApi
    .post(url, { ...data }, { ...config })
    .then(response => response.data)
}

export async function put(url, data, config = {}) {
  return axiosApi
    .put(url, { ...data }, { ...config })
    .then(response => response.data)
}

export async function patch(url, data, config = {}) {
  return axiosApi
    .patch(url, { ...data }, { ...config })
    .then(response => response.data)
}

export async function del(url, config = {}) {
  return await axiosApi
    .delete(url, { ...config })
    .then(response => response.data)
}

export async function getBaseUrl() {
  return await API_URL
}

export async function submitFormData(url, data, method) {
  const authToken = await getAuthToken();
  const token2 = authToken ? JSON.parse(authToken) : ''
  return await axios({
    method: method,
    url: API_URL+url,
    data: data,
    headers: {
      'Content-Type': `multipart/form-data;`,
      'Authorization': `Bearer ${token2}`
    },
  }).then(response => response.data)
}


