import express from 'express'

import { registerUser,userLogout,userLogin,getUsers,createChat,sendMessage,getMessages,
    addParticipantsToGroup
 } from '../Controllers/userController';
import { authenticateUser } from '../Middlewares/userMiddleware';

const userroute = express.Router();

userroute.post('/',registerUser)
userroute.post('/login',userLogin)
userroute.post('/logout',userLogout)
userroute.get('/get-users',authenticateUser,getUsers)
userroute.post('/create-chat',authenticateUser,createChat)
userroute.post('/send-messages',authenticateUser,sendMessage)
userroute.get('/get-messages/:chatId',authenticateUser,getMessages)
userroute.post('/add-users',authenticateUser,addParticipantsToGroup)


export default userroute