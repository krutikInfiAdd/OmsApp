import axios, { AxiosInstance } from 'axios';
import { BaseURl } from './url';

const axiosClient: AxiosInstance = axios.create({
  baseURL: BaseURl || BaseURl,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Add access token to all requests
axiosClient.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem('accessToken');
    if (!config.headers) config.headers = {};

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// Response interceptor
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If unauthorized (401)
    if (error.response?.status === 401 && !(originalRequest as any)._retry) {
      (originalRequest as any)._retry = true;

      const refreshToken = localStorage.getItem('refreshToken');
      const userId = localStorage.getItem('userId');
      console.log('401 detected. Attempting token refresh...', refreshToken, userId);
      if (!refreshToken || !userId) {
        console.error('No refresh token or user ID found.');
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return axiosClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        console.log('🔄 Refreshing token...');

        // Call refresh-token API (important: use plain axios here to avoid recursion)
        const refreshResponse = await axios.post(
          `https://localhost:7068/api/Auth/refresh-token?userId=${userId}`,
          {
            refreshToken: refreshToken, // send refresh token in body
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        const newAccessToken = refreshResponse.data?.accessToken || refreshResponse.data?.token;
        const newRefreshToken = refreshResponse.data?.refreshToken;

        if (!newAccessToken) {
          throw new Error('Refresh token response invalid.');
        }

        // Store new tokens (consistent keys)
        localStorage.setItem('accessToken', newAccessToken);
        if (newRefreshToken) localStorage.setItem('refreshToken', newRefreshToken);

        // Update Axios defaults
        axiosClient.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);
        isRefreshing = false;

        // Retry the original request
        originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken;
        return axiosClient(originalRequest);
      } catch (err) {
        console.error('❌ Token refresh failed:', err);
        processQueue(err, null);
        isRefreshing = false;

        // Clear tokens and handle logout
        // localStorage.removeItem('accessToken');
        // localStorage.removeItem('refreshToken');
        // localStorage.removeItem('userId');

        console.error('Refresh token failed. Redirecting to login...');
        // window.location.href = '/sign-in';

        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
