
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important for cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Request interceptor: Attach Access Token
api.interceptors.request.use(
  (config) => {
    // We don't store access token in localStorage anymore for security (except maybe for initial load check if we wanted, but context handles that)
    // Actually, we need to inject the token from memory. 
    // Since this is a standalone file, we'll rely on the AuthContext to set the default header, 
    // OR we can export a function to set it.
    // For now, let's assume the AuthContext sets `api.defaults.headers.common['Authorization']` when it gets a token.
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle 401 & Refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh token using the HttpOnly cookie
        const { data } = await api.post('/auth/refresh');
        const { accessToken } = data.data;

        // Update default header for future requests
        api.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken;
        
        // Update the failed request header
        originalRequest.headers['Authorization'] = 'Bearer ' + accessToken;

        processQueue(null, accessToken);
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        // If refresh fails, let the AuthContext know via event or just reject
        // The UI should catch this and redirect to login
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
