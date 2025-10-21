import axios from 'axios';

const api = axios.create({
    baseURL: 'https://localhost:7151/api/',
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use((config) => {
    const token = JSON.parse(localStorage.getItem('token'));

    if (token) {
        config.headers.Authorization = `Bearer ${token.token}`;
    }

    return config;
});

// api.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         if (error.response?.status === 401) {
//             // Token expirado o inválido
//             localStorage.removeItem('token');
//             window.location.href = '/login';
//         }
//         return Promise.reject(error);
//     }
// );

export default api;
