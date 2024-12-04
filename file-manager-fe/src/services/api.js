import axios from "axios";
import { getSessionToken, clearSessionToken, clearSessionUser } from "../utilities/auth";
import { toast } from "react-toastify";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = getSessionToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearSessionToken();
      clearSessionUser();
    }
    const message =
      error.response?.data?.message || "An error occurred. Please try again.";
    toast.error(message);
    return Promise.reject(error);
  }
);

//Login
export const login = (credentials) => api.post(`${API_BASE_URL}/auth/login`, credentials);

//Document
export const fetchDocuments = () => api.get(`${API_BASE_URL}/documents`);
export const uploadDocument = (formData) => api.post(`${API_BASE_URL}/documents/upload`, formData, {
  headers: { "Content-Type": "multipart/form-data" }
});
export const deleteDocument = (id) => api.delete(`${API_BASE_URL}/documents/${id}`);
export const downloadDocument = (id) => api.get(`/documents/download/${id}`, {
  responseType: 'blob'
});


//User
export const fetchUsers = () => api.get(`${API_BASE_URL}/users`);
export const addUser = (data) => api.post(`${API_BASE_URL}/users/`, data);
export const manageUser = (userId, data) => api.put(`${API_BASE_URL}/users/${userId}`, data);
export const deleteUser = (userId, data) => api.delete(`${API_BASE_URL}/users/${userId}`, data);
export default api;