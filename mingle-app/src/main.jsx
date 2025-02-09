import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux';
import { store } from './app/store.js';
import App from './App.jsx';
import { SocketProvider } from './context/SocketContext.jsx';
import './App.css'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Provider store={store}>
            <SocketProvider>
                <App />
            </SocketProvider>
        </Provider>
    </StrictMode>
)
