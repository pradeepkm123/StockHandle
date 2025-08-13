import axios from 'axios';

// Works in both CRA and Vite projects:
const isVite = typeof import.meta !== 'undefined' && import.meta.env;
const baseURL =
  (isVite ? import.meta.env?.VITE_API_URL : process.env.REACT_APP_API_URL) ||
  ''; // empty -> CRA proxy handles it; else uses env URL

const client = axios.create({
  baseURL, // '' + '/api/...' => proxied to 5000 in dev if proxy is set
  headers: { 'Content-Type': 'application/json' },
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default client;
