import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api' });

// Attach the saved token to every request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// If the server says the token is bad/expired, log the user out.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || '';
    if (error.response?.status === 401 && !url.includes('/auth/login')) {
      localStorage.removeItem('token');
      window.dispatchEvent(new Event('auth:logout'));
    }
    return Promise.reject(error);
  }
);

// Turns any error into a message that is safe and useful to show.
export function getErrorMessage(error) {
  if (error.response?.data?.message) return error.response.data.message;
  if (error.request) return 'Cannot reach the server. Check that the backend is running.';
  return 'Something went wrong. Please try again.';
}

export default api;
