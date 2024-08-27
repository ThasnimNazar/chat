import { useState, useEffect } from "react";
import { publicApi } from "../Axiosconfig";
import { Card, CardContent, Typography, Box, Avatar, Button, ButtonGroup,CircularProgress } from "@mui/material";


interface User {
    _id: string;
    name: string;
    email: string;
    phoneno: number;
    profileImageUrl: string
}

interface ChatsidebarProps {
    selectchat: (user: User) => void;
}


const Chatsidebar: React.FC<ChatsidebarProps> = ({ selectchat }) => {

    const [users, setUser] = useState<User[]>([])
    const [view, setView] = useState<"allChats" | "groupChats">("allChats");
    const [loading, setLoading] = useState<boolean>(false);

    const groupChats = [
        { _id: "group1", name: "Family Group", participants: ["User1", "User2", "User3"] },
        { _id: "group2", name: "Work Group", participants: ["User4", "User5", "User6"] },
    ];

    useEffect(() => {
        const getUsers = async () => {
            try {
                const response = await publicApi.get('api/user/get-users')
                console.log(response)
                setUser(response.data.users)
            }
            catch (error) {
                console.log(error)
            }
        }
        getUsers()

    }, [])

    return (
        <Box
            sx={{
                width: 300,
                height: "100vh",
                backgroundColor: "#4682B4",
                padding: 2,
                boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
                position: "fixed",
                top: 0,
                left: 0,
                zIndex: 1100,
                overflowY: "auto",
            }}
        >


            <ButtonGroup fullWidth variant="contained" color="primary" sx={{
                height: '40px'
            }}>
                <Button
                    onClick={() => setView("allChats")}
                    variant={view === "allChats" ? "contained" : "outlined"}
                    sx={{
                        height: '40px',
                        backgroundColor: view === "allChats" ? "#4682B4" : "#fff",
                        color: view === "allChats" ? "#fff" : "#4caf50",
                        borderColor: "#4682B4",
                        '&:hover': {
                            backgroundColor: view === "allChats" ? "#fff" : "#f1f1f1",
                            color: '#4682B4'
                        },
                    }}
                >
                    All Chats
                </Button>
                <Button
                    onClick={() => setView("groupChats")}
                    variant={view === "groupChats" ? "contained" : "outlined"}
                    sx={{
                        height: '40px',
                        backgroundColor: view === "groupChats" ? "#1976d2" : "#fff",
                        color: view === "groupChats" ? "#fff" : "#1976d2",
                        borderColor: "#1976d2",
                        '&:hover': {
                            backgroundColor: view === "groupChats" ? "#1565c0" : "#f1f1f1",
                        },
                    }}
                >
                    Group Chats
                </Button>
            </ButtonGroup>

            {view === "allChats" ? (
                <Box mt={2}>
                    {users.map((user) => (
                        <Card
                        key={user._id}
                        sx={{
                          mb: 2,
                          display: 'flex',
                          alignItems: 'center',
                          cursor: 'pointer',
                          transition: 'background-color 0.3s ease',
                          '&:hover': {
                            backgroundColor: '#F0F0F0',
                          },
                        }}
                        onClick={() => selectchat(user)}
                      >
                            <Box sx={{ padding: 1 }}>
                                <Avatar
                                    alt={user.name}
                                    src={user.profileImageUrl || "/defaultProfile.jpg"}
                                    sx={{ width: 60, height: 60 }}
                                />
                            </Box>
                            <CardContent>
                                <Typography variant="h6">{user.name}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {user.email}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {user.phoneno}
                                </Typography>
                            </CardContent>
                            {loading && (
                          
                          <CircularProgress size={24} sx={{ marginLeft: 'auto' }} /> // Show loading indicator
                            )}
                        </Card>
                    ))}
                </Box>
            ) : (
                <Box mt={2}>
                    {groupChats.map((group) => (
                        <Card key={group._id} sx={{ mb: 2, display: "flex", alignItems: "center" }}>
                            <CardContent>
                                <Typography variant="h6">{group.name}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Participants: {group.participants.join(", ")}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default Chatsidebar;
