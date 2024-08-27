import { privateApi } from "../Axiosconfig";
import Chatsidebar from "../Components/Chatsidebar"
import { useEffect, useState,useRef } from "react";
import { toast } from 'react-toastify'
import Chatbubble from "../Components/Chatbubble";
import useSocket from "../Socket/useSocket";

interface User {
    _id: string;
    name: string;
    email: string;
    phoneno: number;
    profileImageUrl: string

}

interface Message {
    _id: string;
    chatId: string;
    sender: string;
    content: string;
    timestamp: string;
    imageUrl?: string;
    VideoUrl?: string;
    AudioUrl?: string;
    seenBy: string[];

}

const Chatscreen: React.FC = () => {
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [chatId, setChatId] = useState<string>('')
    const [chatMessages, setChatMessages] = useState<Message[]>([]);
    const chatWindowRef = useRef<HTMLDivElement>(null);
    const [page, setPage] = useState<number>(1);
    const [hasMoreMessages, setHasMoreMessages] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
    const socket = useSocket();
    
    const userInfo = localStorage.getItem('userInfo')
    console.log(userInfo,'user')
    const parsedUserInfo = userInfo ? JSON.parse(userInfo) : null;
    const userId = parsedUserInfo?._id || '';
    console.log(userId,'id')


    const handlechat = (user: User) => {
        console.log('heyy')
        setSelectedUser(user)
        setPage(1);  
        setChatMessages([]);
    }



    console.log(selectedUser,'ss')
    const id = selectedUser?._id

    useEffect(() => {
        const creatChat = async () => {
            if (selectedUser) {
                try {
                    console.log(selectedUser._id)
                    const response = await privateApi.post('/create-chat', {
                        userId: id
                    })
                    console.log(response,'response')
                    const chatData = response.data;
                    console.log(chatData,'chats')
                    console.log(chatData._id,'chatid')
                    setChatId(chatData._id);
                    const messagesResponse = await privateApi.get(`/get-messages/${chatData._id}`,{
                        params: { page, limit: 10 }
                    });
                    console.log(messagesResponse.data.messages, 'mes')
                    const newMessages = response.data.messages;
                    if (newMessages.length === 0) {
                        setHasMoreMessages(false);
                    } else {
                        setChatMessages((prevMessages) => [...newMessages.reverse(), ...prevMessages]);
                        setPage((prevPage) => prevPage + 1);
                    }
                    if (socket) {
                        console.log(socket,'socket')
                        socket.emit('joinRoom', { roomId: response.data._id });
                    }

                }
                catch (error) {
                    toast.error(error instanceof Error ? error.message : "unable to create chat");
                }

            }
        }
        creatChat()
    }, [selectedUser])

    useEffect(() => {
        if (socket) {
          const handleReceiveMessage = (message: Message) => {
            setChatMessages((prevMessages) => {
              if (!prevMessages.some(msg => msg._id === message._id)) {
                return [...prevMessages, message];
              }
              return prevMessages;
            });
          };
        
          socket.on('receiveMessage', handleReceiveMessage);
    
          return () => {
            socket.off('receiveMessage', handleReceiveMessage);
          };
        }
      }, [socket]);

      const handleScroll = () => {
        if (chatWindowRef.current && chatWindowRef.current.scrollTop === 0 && hasMoreMessages && !loading) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    const handleSendMessage = async (message: Message, image: File | null, video: File | null, audio: File | null) => {
        console.log('hello')
        console.log(chatId,'kk')
        console.log(userId,'uu')
        if (chatId && userId && (message.content.trim() || image || video || audio)) {
            try {
                console.log('send')
                const formData = new FormData();
                formData.append('chatId', chatId);
                formData.append('senderId', userId);
                formData.append('content', message.content);
    
                formData.append('timestamp', message.timestamp);

                  console.log(formData,'ff')          
                const response = await privateApi.post('/send-messages', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                console.log(response, 'resss')

                const newMessage = response.data.message;
                setChatMessages((prevMessages) => [...prevMessages, newMessage]);
                if (socket) {
                    socket.emit('sendMessage', newMessage);
                }

            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    };



    return (
        <>
            <div className="flex h-screen">
                <div className="w-1/4 h-full bg-white p-4">
                    <Chatsidebar selectchat={handlechat} />
                </div>
                <div className="w-3/4 h-full bg-white p-4 flex flex-col"ref={chatWindowRef} onScroll={handleScroll}>
                    {selectedUser ? (
                        <Chatbubble
                            user={selectedUser}
                            chatId={chatId!}
                            chatMessage={chatMessages}
                            onSendMessage={handleSendMessage}
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            Click or select a chat to message
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default Chatscreen