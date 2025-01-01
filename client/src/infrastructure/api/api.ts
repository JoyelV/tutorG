import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    withCredentials: true, 
});

const refreshAccessToken = async () => {
    try {
        const response = await api.post('/refresh-token');
        const { token } = response.data;
        localStorage.setItem('token', token);
        return token;
    } catch (error) {
        console.error('Failed to refresh token:', error);
        throw error; 
    }
};

api.interceptors.response.use(
    (response) => response, 
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status&& !originalRequest._retry) {
            originalRequest._retry = true; 
            try {
                const newToken = await refreshAccessToken();
                api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
                originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                return api(originalRequest); 
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                window.location.href = '/login';
            }
        }
        return Promise.reject(error); 
    }
);

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

export default api;
