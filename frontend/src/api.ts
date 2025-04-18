import axios from 'axios';

const api = axios.create({
  baseURL: `http://localhost:3000/api`,
  withCredentials: true,
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;
    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await api.post('/auth/refresh');
        return api(originalRequest); 
      } catch (e) {
        window.location.href = '/unauthorized';
      }
    }
    return Promise.reject(err);
  }
);

export default api;
