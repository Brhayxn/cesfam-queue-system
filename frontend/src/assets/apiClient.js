// apiClient.js
import axios from 'axios';


//Cambiar por ip local al compilar
const apiClient = axios.create({
    baseURL: 'http://192.168.1.12:3000'
});

// Interceptor para agregar el token automáticamente
apiClient.interceptors.request.use(config => {
    const token = sessionStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

export default apiClient;