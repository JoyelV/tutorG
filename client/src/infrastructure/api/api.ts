import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    withCredentials: true, // Enables sending and receiving cookies
});

const refreshAccessToken = async () => {
    try {
        console.log('Attempting to refresh token...');

        const response = await api.post('/refresh-token');
        const { token } = response.data;
        console.log('New access token received:', token);

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
        console.log('Interceptor caught an error:', error.response?.status);

        const originalRequest = error.config;

        if (error.response?.status&& !originalRequest._retry) {
            console.log('Refreshing token...');

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
