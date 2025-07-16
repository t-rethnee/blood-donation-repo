// src/api/apiClient.js
import axios from 'axios';
import { auth } from '../firebase/firebaseConfig';

// Base Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000', // Change as needed
});

// Helper: Get Firebase token
const getFirebaseToken = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error('User not logged in');
  return await user.getIdToken();
};

// Example: GET protected data
export const getProtectedData = async () => {
  const token = await getFirebaseToken();

  const res = await api.get('/api/protected-route', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

// Example: POST protected data
export const postProtectedData = async (data) => {
  const token = await getFirebaseToken();

  const res = await api.post('/api/protected-route', data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

// 🟢 Add more API functions as needed
