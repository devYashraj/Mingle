import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URI,
    withCredentials: true,
    timeout: 120000,
})


apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("mingleAccessToken");
        if(token){
            config.headers.Authorization - `Bearer ${token}`
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if(error.response && error.response.status === 401){
            localStorage.removeItem("mingleUserState")
            localStorage.removeItem("mingleAccessToken")
            localStorage.removeItem("mingleRefreshToken")
        }
        return Promise.reject(error)
    }
)

export default apiClient;