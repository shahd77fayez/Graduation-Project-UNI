// axiosConfig.js
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000/api', // Your backend URL
    withCredentials: true // This ensures cookies are sent with requests
});

export default axiosInstance;
