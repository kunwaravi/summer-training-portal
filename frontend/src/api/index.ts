import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  // Anti-CSRF custom header validation (Issue #11)
  config.headers['X-Requested-With'] = 'XMLHttpRequest';
  return config;
});

export default api;
