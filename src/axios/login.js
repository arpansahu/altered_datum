import axios from 'axios';

// const baseURL = 'http://127.0.0.1:8004/';
const baseURL = 'https://altered-datum-api.arpansahu.me';

const axiosInstance = axios.create({
    baseURL: baseURL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
    },
});

export default axiosInstance;
