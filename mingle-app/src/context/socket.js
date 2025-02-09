import { io } from 'socket.io-client';

const getSocket = () => {

    const token = localStorage.getItem("mingleAccessToken");
    
    return io(import.meta.env.VITE_SOCKET_URI, {
        withCredentials: true,
        reconnection: true,
        auth: { token }
    })
}

export default getSocket;