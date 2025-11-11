// api.ts
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import axiosClient from './axiosClient'; // ✅ Import your configured client

// Generic request function using axiosClient
async function request<T = any>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> {
  const finalConfig: AxiosRequestConfig = {
    ...config,
    method,
    url,
    data,
  };

  // ✅ Use axiosClient instead of new axios instance
  return axiosClient.request<T>(finalConfig);
}

// Reusable HTTP methods
export const http = {
  get: <T = any>(url: string, config?: AxiosRequestConfig) =>
    request<T>('GET', url, undefined, config),

  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    request<T>('POST', url, data, config),

  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    request<T>('PUT', url, data, config),

  delete: <T = any>(url: string, config?: AxiosRequestConfig) =>
    request<T>('DELETE', url, undefined, config),
};

export default http;
