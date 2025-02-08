import { io } from 'socket.io-client';

const token = localStorage.getItem("mingleAccessToken");

const socket = io(import.meta.env.VITE_SOCKET_URI, {
    withCredentials: true,
    reconnection: true,
    auth: { token }
})

export default socket;