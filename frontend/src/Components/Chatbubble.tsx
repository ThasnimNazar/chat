import { useState } from 'react';
import SendIcon from '@mui/icons-material/Send';
import VideoFileIcon from '@mui/icons-material/VideoFile';
import ImageIcon from '@mui/icons-material/Image';
import HeadphonesIcon from '@mui/icons-material/Headphones';

import { IconButton, InputBase, Box, Typography } from '@mui/material';

interface Message {
    _id: string;
    chatId: string;
    sender: string;
    content: string;
    timestamp: string;
    ImageUrl?: string;
    VideoUrl?: string;
    AudioUrl?: string;
    seenBy: string[];

}

interface ChatBubbleProps {
    user: {
        _id: string;
        name: string;
        email: string;
        phoneno: number;
        profileImageUrl: string
    };
    chatId: string;
    chatMessage: Message[];
    onSendMessage: (message: Message, image: File | null, video: File | null, audio: File | null) => void;

}

const Chatbubble: React.FC<ChatBubbleProps> = ({ user, chatId, chatMessage, onSendMessage }) => {
    const [message, setMessage] = useState<string>('');
    const [video, setVideo] = useState<File | null>(null)
    const [audio, setAudio] = useState<File | null>(null)
    const [image, setImage] = useState<File | null>(null);
    const userInfo = localStorage.getItem('userInfo')
    console.log(user,'user')
    const parsedUserInfo = userInfo ? JSON.parse(userInfo) : null;
    const userId = parsedUserInfo?._id || '';
    

    const handleSendMessage = () => {
        if (message.trim() || image || video || audio) {
            const newMessage: Message = {
                _id: Date.now().toString(),
                chatId: chatId,
                sender: userId!,
                content: message,
                timestamp: new Date().toISOString(),
                seenBy: []

            };
            

            console.log(newMessage, 'n');

            onSendMessage(newMessage, image, video, audio);
            setMessage('');
            setImage(null);
            setVideo(null);
            setAudio(null)
        }
    }

    return (
        <Box
            className="relative flex flex-col h-full mr-10"
            sx={{
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                minHeight: '500px',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px',
                    borderBottom: '1px solid #e0e0e0',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '8px 8px 0 0',
                }}
            >
                <Typography variant="h6">Chat</Typography>
            </Box>

            <Box
                sx={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '16px',
                    '&::-webkit-scrollbar': {
                        width: '8px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: '#888',
                        borderRadius: '8px',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                        backgroundColor: '#555',
                    },
                }}
            >
                {chatMessage.map((msg) => (
                    
                  <Box
                  key={msg._id}
                  sx={{
                      display: 'flex',
                      justifyContent: msg.sender === userId ? 'flex-end' : 'flex-start',
                      mb: '16px',
                  }}
              >
                  <Box
                      sx={{
                          backgroundColor: msg.sender === userId ? '#1976d2' : '#e0e0e0',
                          color: msg.sender === userId ? 'white' : 'black',
                          padding: '8px 12px',
                          borderRadius: '16px',
                          maxWidth: '70%',
                          wordBreak: 'break-word',
                          textAlign: msg.sender === userId ? 'right' : 'left',
                      }}
                  >
                      {msg.content}
                      {msg.ImageUrl && <img src={msg.ImageUrl} alt="Image" style={{ maxWidth: '100%' }} />}
                      {msg.VideoUrl && <video src={msg.VideoUrl} controls style={{ maxWidth: '100%' }} />}
                      {msg.AudioUrl && <audio src={msg.AudioUrl} controls />}
                  </Box>
              </Box>
                ))}
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px 16px',
                    borderTop: '1px solid #e0e0e0',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '0 0 8px 8px',
                }}
            >
                <InputBase
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    sx={{
                        flex: 1,
                        padding: '8px 12px',
                        borderRadius: '16px',
                        backgroundColor: 'white',
                        border: '1px solid #e0e0e0',
                        marginRight: '8px',
                    }}
                    placeholder="Type your message here..."
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files?.[0] || null)}
                    style={{ display: 'none' }}
                    id="image-upload"
                />
                <label htmlFor="image-upload">
                    <IconButton color="primary" component="span" sx={{ borderRadius: '50%', mr: 1 }}>
                        <ImageIcon />
                    </IconButton>
                </label>
                <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => setVideo(e.target.files?.[0] || null)}
                    style={{ display: 'none' }}
                    id="video-upload"
                />
                <label htmlFor="video-upload">
                    <IconButton color="primary" component="span" sx={{ borderRadius: '50%', mr: 1 }}>
                        <VideoFileIcon />
                    </IconButton>
                </label>
                <input
                    type="file"
                    accept="audio/*"
                    onChange={(e) => setAudio(e.target.files?.[0] || null)}
                    style={{ display: 'none' }}
                    id="audio-upload"
                />
                <label htmlFor="audio-upload">
                    <IconButton color="primary" component="span" sx={{ borderRadius: '50%', mr: 1 }}>
                        <HeadphonesIcon />
                    </IconButton>
                </label>
                <IconButton
                    onClick={handleSendMessage}
                    color="primary"
                    sx={{
                        borderRadius: '50%',
                        '&:hover': {
                            backgroundColor: '#e0e0e0',
                        },
                    }}
                >
                    <SendIcon />
                </IconButton>
            </Box>
        </Box>
    );
};

export default Chatbubble;
