import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://sql-studio-71li.onrender.com/api',
    timeout: 30000,
    headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        const message =
            error.response?.data?.message ||
            error.message ||
            'An unexpected error occurred.';
        return Promise.reject(new Error(message));
    }
);

// Assignment API
export const assignmentsApi = {
    list: () => api.get('/assignments'),
    get: (id) => api.get(`/assignments/${id}`),
    execute: (id, query, sessionId) =>
        api.post(`/assignments/${id}/execute`, { query, sessionId }),
    hint: (id, query) =>
        api.post(`/assignments/${id}/hint`, { query }),
    attempts: (id, sessionId) =>
        api.get(`/assignments/${id}/attempts`, { params: { sessionId } }),
};

export default api;
