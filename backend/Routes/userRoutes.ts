import express from 'express'

import {
    registerUser, userLogout, userLogin, getUsers, createChat, sendMessage, getMessages,
    addParticipantsToGroup
} from '../Controllers/userController';
import { authenticateUser } from '../Middlewares/userMiddleware';

const userroute = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and authentication
 */

/**
 * @swagger
 * /api/user:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The user's name
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 description: The user's email address
 *                 example: john.doe@example.com
 *               phoneno:
 *                 type: string
 *                 description: The user's phone number
 *                 example: +1234567890
 *               password:
 *                 type: string
 *                 description: The user's password
 *                 example: Password123!
 *               confirmPassword:
 *                 type: string
 *                 description: Confirmation of the user's password
 *                 example: Password123!
 *     responses:
 *       200:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Successfully completed registration
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The user's ID
 *                     name:
 *                       type: string
 *                       description: The user's name
 *                     email:
 *                       type: string
 *                       description: The user's email address
 *                     phoneno:
 *                       type: string
 *                       description: The user's phone number
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *       400:
 *         description: Bad request, such as missing fields or password mismatch
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All fields are required or Password doesn't match
 *       402:
 *         description: User already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User already exists
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An unknown error occurred
 */
userroute.post('/', registerUser);

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: User login
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email address
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 description: The user's password
 *                 example: Password123!
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User logged in successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The user's ID
 *                     name:
 *                       type: string
 *                       description: The user's name
 *                     email:
 *                       type: string
 *                       description: The user's email address
 *                     phoneno:
 *                       type: string
 *                       description: The user's phone number
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *       400:
 *         description: Bad request, such as missing fields or incorrect password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All fields are required or Incorrect password
 *       402:
 *         description: User does not exist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User doesn't exist
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An unknown error occurred
 */
userroute.post('/login', userLogin)

/**
 * @swagger
 * /api/user/logout:
 *   post:
 *     summary: User logout
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: User logged out successfully
 */
userroute.post('/logout', userLogout)

/**
 * @swagger
 * /api/user/get-users:
 *   get:
 *     summary: Get all users except the authenticated user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users excluding the authenticated user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: The user's ID
 *                       name:
 *                         type: string
 *                         description: The user's name
 *                       email:
 *                         type: string
 *                         description: The user's email address
 *                       phoneno:
 *                         type: string
 *                         description: The user's phone number
 *               example:
 *                 users:
 *                   - id: "60b8d295f2eae5677b4a1d6f"
 *                     name: "John Doe"
 *                     email: "john.doe@example.com"
 *                     phoneno: "+1234567890"
 *                   - id: "60b8d295f2eae5677b4a1d70"
 *                     name: "Jane Smith"
 *                     email: "jane.smith@example.com"
 *                     phoneno: "+0987654321"
 *       401:
 *         description: Unauthorized, user not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not authenticated"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An unknown error occurred"
 */
userroute.get('/get-users', authenticateUser, getUsers)

/**
 * @swagger
 * /api/user/create-chat:
 *   post:
 *     summary: Create a new chat
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user to chat with. Required for 1-on-1 chats.
 *               isGroupChat:
 *                 type: boolean
 *                 description: Flag to indicate if the chat is a group chat.
 *               groupName:
 *                 type: string
 *                 description: The name of the group chat. Required if `isGroupChat` is true.
 *               groupDescription:
 *                 type: string
 *                 description: The description of the group chat. Required if `isGroupChat` is true.
 *     responses:
 *       201:
 *         description: Chat created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The ID of the chat
 *                 isGroupChat:
 *                   type: boolean
 *                   description: Indicates if the chat is a group chat
 *                 groupName:
 *                   type: string
 *                   description: The name of the group chat (if applicable)
 *                 groupDescription:
 *                   type: string
 *                   description: The description of the group chat (if applicable)
 *                 participants:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: List of participant IDs in the chat
 *                 messages:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       senderId:
 *                         type: string
 *                         description: The ID of the sender
 *                       content:
 *                         type: string
 *                         description: The content of the message
 *                       timestamp:
 *                         type: string
 *                         description: The timestamp of the message
 *       400:
 *         description: Bad request - Required fields are missing or invalid
 *       401:
 *         description: Unauthorized - User not authenticated
 *       500:
 *         description: Internal Server Error - An unknown error occurred
 */
userroute.post('/create-chat', authenticateUser, createChat)

/**
 * @swagger
 * /api/user/send-messages:
 *   post:
 *     summary: Send a message in a chat
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               chatId:
 *                 type: string
 *                 description: The ID of the chat where the message will be sent.
 *               senderId:
 *                 type: string
 *                 description: The ID of the user sending the message.
 *               content:
 *                 type: string
 *                 description: The content of the message.
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *                 description: The timestamp when the message was sent.
 *     responses:
 *       200:
 *         description: Message sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The ID of the message
 *                 chatId:
 *                   type: string
 *                   description: The ID of the chat where the message was sent
 *                 senderId:
 *                   type: string
 *                   description: The ID of the sender
 *                 text:
 *                   type: string
 *                   description: The content of the message
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   description: The timestamp when the message was sent
 *       400:
 *         description: Bad request - All required fields must be provided
 *       500:
 *         description: Internal Server Error - An unknown error occurred
 */
userroute.post('/send-messages', authenticateUser, sendMessage)

/**
 * @swagger
 * /api/user/get-messages/{chatId}:
 *   get:
 *     summary: Retrieve message history for a specific chat
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: chatId
 *         in: path
 *         required: true
 *         description: The ID of the chat to retrieve messages for.
 *         schema:
 *           type: string
 *       - name: page
 *         in: query
 *         required: false
 *         description: Page number for pagination.
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: limit
 *         in: query
 *         required: false
 *         description: Number of messages per page.
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Successfully retrieved messages
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 messages:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: The ID of the message
 *                       chatId:
 *                         type: string
 *                         description: The ID of the chat
 *                       senderId:
 *                         type: string
 *                         description: The ID of the sender
 *                       text:
 *                         type: string
 *                         description: The content of the message
 *                       timestamp:
 *                         type: string
 *                         format: date-time
 *                         description: The timestamp when the message was sent
 *       400:
 *         description: Bad request - Invalid query parameters
 *       500:
 *         description: Internal Server Error - An unknown error occurred
 */
userroute.get('/get-messages/:chatId', authenticateUser, getMessages)

/**
 * @swagger
 * /api/chat/{chatId}/participants:
 *   post:
 *     summary: Add participants to a group chat
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: chatId
 *         in: path
 *         required: true
 *         description: The ID of the group chat to add participants to.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               participantIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of user IDs to add to the group chat.
 *     responses:
 *       200:
 *         description: Successfully added participants to the group chat
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                 chat:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The ID of the chat
 *                     isGroupChat:
 *                       type: boolean
 *                       description: Indicates if the chat is a group chat
 *                     groupName:
 *                       type: string
 *                       description: The name of the group chat
 *                     groupDescription:
 *                       type: string
 *                       description: Description of the group chat
 *                     participants:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: List of participant IDs in the group chat
 *                     messages:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: List of message IDs in the group chat
 *       400:
 *         description: Bad request - Invalid chat ID or participant IDs
 *       401:
 *         description: Unauthorized - User not authenticated
 *       404:
 *         description: Not Found - Chat not found
 *       500:
 *         description: Internal Server Error - An unknown error occurred
 */
userroute.post('/add-users', authenticateUser, addParticipantsToGroup)


export default userroute