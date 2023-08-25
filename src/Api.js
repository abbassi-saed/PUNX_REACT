import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:43572',
});

// // Add an interceptor to set the authorization header
// const storedToken = localStorage.getItem('authToken');

// apiClient.interceptors.request.use((config) => {
//   if (storedToken) {
//     config.headers.Authorization = `Bearer ${storedToken}`;
//   }
//   return config;
// });

export default apiClient;
