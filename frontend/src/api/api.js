import axios from 'axios';

const api = axios.create({
    baseURL: 'https://cravecart-qm4q.onrender.com/api'
});

// Add token to headers if it exists
api.interceptors.request.use((config) => {
    const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;
    if (userInfo && userInfo.token) {
        config.headers.Authorization = `Bearer ${userInfo.token}`;
    }
    return config;
});

export default api;
