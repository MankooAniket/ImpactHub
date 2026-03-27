import axios from 'axios';

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Attach token to every request automatically
API.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user');
    if (user) {
      const parsed = JSON.parse(user);
      if (parsed.token) {
        config.headers.Authorization = `Bearer ${parsed.token}`;
      }
    }
  }
  return config;
});

// Auth
export const registerUser = (data: object) =>
  API.post('/api/auth/register', data);

export const loginUser = (data: object) =>
  API.post('/api/auth/login', data);

export const getMe = () =>
  API.get('/api/auth/me');

// NGOs
export const getAllNGOs = () =>
  API.get('/api/ngos');

export const getNGOById = (id: string) =>
  API.get(`/api/ngos/${id}`);

export const getMyNGO = () =>
  API.get('/api/ngos/me');

export const createNGO = (data: object) =>
  API.post('/api/ngos', data);

export const updateNGO = (id: string, data: object) =>
  API.put(`/api/ngos/${id}`, data);

// Events
export const getAllEvents = (params?: object) =>
  API.get('/api/events', { params });

export const getEventById = (id: string) =>
  API.get(`/api/events/${id}`);

export const createEvent = (data: object) =>
  API.post('/api/events', data);

export const updateEvent = (id: string, data: object) =>
  API.put(`/api/events/${id}`, data);

export const deleteEvent = (id: string) =>
  API.delete(`/api/events/${id}`);

// Volunteer
export const registerForEvent = (id: string) =>
  API.post(`/api/events/${id}/register`);

export const cancelRegistration = (id: string) =>
  API.delete(`/api/events/${id}/register`);

export const getMyEvents = () =>
  API.get('/api/volunteers/events');

// Admin
export const getAdminStats = () =>
  API.get('/api/admin/stats');

export const getAllNGORequests = () =>
  API.get('/api/admin/ngos');

export const verifyNGO = (id: string, verified: boolean) =>
  API.put(`/api/admin/ngos/${id}/verify`, { verified });

export const getAllUsers = () =>
  API.get('/api/admin/users');

export const deleteUser = (id: string) =>
  API.delete(`/api/admin/users/${id}`);

export const deleteEventAdmin = (id: string) =>
  API.delete(`/api/admin/events/${id}`);

export default API;