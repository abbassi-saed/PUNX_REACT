import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:64888',
});

export default apiClient;
