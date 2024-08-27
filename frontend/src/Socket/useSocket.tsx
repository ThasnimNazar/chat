import { useContext } from 'react';
import SocketContext from './socket';

const useSocket = () => {
    return useContext(SocketContext);
};

export default useSocket;
