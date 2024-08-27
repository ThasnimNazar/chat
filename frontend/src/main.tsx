import { createRoot } from 'react-dom/client'
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Chatscreen from './Screens/Chatscreen.tsx';
import App from './App.tsx'
import './index.css'
import { SocketProvider } from './Socket/socket.tsx';

const rootElement = document.getElementById('root')!;

const root = createRoot(rootElement);

root.render(
  <SocketProvider>
  <React.StrictMode>
    <Router>
     <Routes>
     <Route path ='/' element = {  <App />}/>
     <Route path ='/user/chat' element = { <Chatscreen/>}/>
     </Routes>
    </Router>
    <ToastContainer />
  </React.StrictMode>
  </SocketProvider>
)
