import { createContext, useContext, useEffect, useState } from 'react';
import getSocket from './socket.js';
import { useSelector } from 'react-redux';
 
const SocketContext = createContext(null);

const SocketProvider = ({children}) => {

    const [socket, setSocket] = useState(null);
    const authStatus = useSelector((state)=>state.auth.status);

    useEffect(()=>{

        if(!authStatus)
            return;

        const newSocket = getSocket();

        setSocket(newSocket);

        return ()=>{
            newSocket.disconnect();
        }

    },[authStatus])

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

const useSocket = () => {
    return useContext(SocketContext);
};

export {SocketProvider, useSocket}