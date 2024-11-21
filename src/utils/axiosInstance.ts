import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAuthStore } from '../stores/useAuthStore';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 1000, //ms
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach token to the header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token.accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor to handle unauthorized error response (401)
axiosInstance.interceptors.response.use(
  (response) => response, // Directly return successful responses.
  async (error) => {
    const originalRequest = error.config;
    const token = useAuthStore.getState().token;
    if (token && error.response.status === 401) {
      try {
        // Make a request to refresh the token.
        const { data } = await axios.get(
          `${axiosInstance.defaults.baseURL}auth/refresh`,
          {
            headers: { Authorization: `Bearer ${token.refreshToken}` },
          },
        );

        // Update the token in the store.
        useAuthStore.getState().setToken({
          accessToken: data.data.accessToken,
          refreshToken: token.refreshToken,
        });

        // Retry the original request with the new access token
        return axiosInstance(originalRequest);
      } catch (error) {
        // Clear token if refresh failed
        useAuthStore.getState().clearToken();

        // Clear query data and cache
        const queryClient = useQueryClient();
        queryClient.clear();

        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
