import asyncHandler from 'express-async-handler'
import bcrypt from 'bcryptjs'
import { Request, Response } from 'express'
import User, { UserType, UserDocument } from '../Models/userModel'
import { Types } from 'mongoose'
import generateUserToken from '../Authentication/generateuserToken'
import Chat from '../Models/chatModel'
import Message from '../Models/messageModel'

interface CustomRequest extends Request {
    user?: UserType;
}


const registerUser = async (req: Request, res: Response) => {
    try {
        const { name, email, phoneno, password, confirmPassword } = req.body;

        if (!name || !email || !phoneno || !password || !confirmPassword) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        const userExist = await User.findOne({ email }).select('-password') as (UserType & { _id: Types.ObjectId }) | null;

        if (userExist) {
            return res.status(402).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            phoneno,
            password: hashedPassword,
            role: 'user'
        });

        await user.save();

        const token = generateUserToken(res, user._id as Types.ObjectId);

        const userWithoutPassword = await User.findById(user._id).select('-password').lean();

        res.status(200).json({ message: 'Successfully completed registration', user: userWithoutPassword, token });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
}

const userLogin = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if(!email || !password){
            res.status(400).json({ message: 'All fields are required' });
            return 
        }

        const user = await User.findOne({ email }).select('-password') as (UserType & { _id: Types.ObjectId }) | null;

        if (!user) {
            res.status(402).json({ message: "user dont exists" })
            return;
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            res.status(400).json({ message: 'Incorrect password' });
            return;
        }


        const token = generateUserToken(res, user?._id);
        res.status(200).json({ message: 'user logged in successfully', user,token });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
})

const userLogout = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    try {
        res.cookie('userjwt', '', {
            httpOnly: true,
            expires: new Date(0)
        })
        res.status(200).json({ message: 'user logout' })
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
})

const getUsers = asyncHandler(async (req: CustomRequest, res: Response) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'user not authenticated' })
        }
        const userId = req.user?._id;
        
        const users = await User.find({
            _id: {
                $ne: userId
            },
        }).select('-password');
        res.status(200).json({ users })
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
})

const createChat = async (req: CustomRequest, res: Response) => {
    try {
        const { userId, isGroupChat, groupName, groupDescription } = req.body;

        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const senderId = req.user._id;

        if(isGroupChat) {
            console.log('hey')
            if (!groupName || !groupDescription) {
                return res.status(400).json({ message: 'Group name and description are required for group chats' });
            }

            let chat = await Chat.findOne({
                isGroupChat: true,
                groupName
            });
            

            if (!chat) {
                chat = new Chat({
                    isGroupChat: true,
                    groupName,
                    groupDescription,
                    participants: [senderId],
                    messages: []
                });
                await chat.save();
            }
            console.log(chat,'chat')

            return res.status(201).json(chat);
        } else {
            let chat = await Chat.findOne({
                senderId: senderId,
                receiverId: userId
            });

            if (!chat) {
                chat = await Chat.findOne({
                    senderId: userId,
                    receiverId: senderId
                });
            }

            if (!chat) {
                chat = new Chat({
                    senderId: senderId,
                    receiverId: userId,
                    messages: []
                });
                await chat.save();
            }

            return res.status(201).json(chat);
        }
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
};



const sendMessage = async (req: Request, res: Response) => {
    try {

        const { chatId, senderId, content, timestamp } = req.body;

        if (!chatId || !senderId || !content || !timestamp) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const message = new Message({
            chatId: chatId,
            senderId: senderId,
            text: content,
            timestamp: new Date(timestamp),
        });

        await message.save();
        console.log(message, 'msg')

        await Chat.findByIdAndUpdate(
            chatId,
            {
                $push: { messages: message._id }
            },
            { new: true }
        );
        res.status(200).json({ message })
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            res.status(500).json({ message: error.message });
        } else {
            console.error('An unknown error occurred');
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
}



const getMessages = asyncHandler(async (req: Request<{ chatId: string }>, res: Response) => {
    try {
        const { chatId } = req.params;

        const page = parseInt(req.query.page as string, 10) || 1; // Default to page 1
        const limit = parseInt(req.query.limit as string, 10) || 10; // Default to limit 10
        console.log(`Chat ID: ${chatId}, Page: ${page}, Limit: ${limit}`);
        const skip = (page - 1) * limit;
        console.log(`Skip: ${skip}`);

        const messages = await Message.find({ chatId })
            .sort({ timestamp: -1 }) // Sort by newest first
            .skip(skip)// Pagination logic
            .limit(limit); // Limit the number of results

        res.status(200).json({ messages });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            res.status(500).json({ message: error.message });
        } else {
            console.error('An unknown error occurred');
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
})

const addParticipantsToGroup = async (req: CustomRequest, res: Response) => {
    try {
        const { chatId, participantIds } = req.body;

        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        if (!chatId || !Array.isArray(participantIds) || participantIds.length === 0) {
            return res.status(400).json({ message: 'Invalid chat ID or participant IDs' });
        }

        const chat = await Chat.findById(chatId);

        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }

        chat.participants = Array.from(new Set([...chat.participants, ...participantIds])); 

        await chat.save();

        res.status(200).json({ message: 'Participants added successfully', chat });

    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
};


export { registerUser, userLogin, userLogout, getUsers, createChat, sendMessage, getMessages,addParticipantsToGroup

 }