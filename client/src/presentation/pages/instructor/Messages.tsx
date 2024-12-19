import React, { useState, useEffect, useRef } from 'react';
import { Avatar, TextField, IconButton, Typography, Badge, List, ListItem, ListItemAvatar, ListItemText, InputAdornment, Tooltip, CircularProgress } from '@mui/material';
import { Send, VideoCall, Mic, Search, AttachFile } from '@mui/icons-material';
import api from '../../../infrastructure/api/api';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';

interface Instructor {
  id: string;
  name: string;
  image: string;
}

interface Message {
  sender: 'self' | 'other';
  text: string;
  time: string;
  image?: string;
  mediaUrl?: string;
}

interface Props {
  userType?: 'Instructor' | 'User';
}

const TutorChatInterface: React.FC<Props> = ({ userType = 'Instructor' }) => {
  const [users, setUsers] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<Instructor | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const socket = useRef<Socket | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null); // For image preview

  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    socket.current = io('http://localhost:5000');

    socket.current.on('receive_message', (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.current.on('error', (error: string) => {
      console.error("Socket error:", error);
    });  

    return () => {
      socket.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        setLoading(true);
        const response = await api.get('/instructor/students');
        const data = response.data.map((item: any) => ({
          id: item.studentId._id,
          name: item.studentId.username,
          image: `http://localhost:5000/${item.studentId.image}`, 
        }));
        setUsers(data);
        if (data.length > 0) {
          setSelectedUser(data[0]);
          setMessages([{
            sender: 'other',
            text: `Hi! I'm ${data[0].name}, how can I assist you today?`,
            time: new Date().toLocaleTimeString(),
          }]);
        }
      } catch (err) {
        setError('Unable to fetch the list of tutors. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTutors();
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (newMessage.trim() || image) {
      let imageUrl = '';

      // Upload image if available
      if (image) {
        imageUrl = await submitImage(image);
      }

      const message: Message = {
        sender: 'self',
        text: newMessage,
        time: new Date().toLocaleTimeString(),
        image: imageUrl || undefined,
      };

      setMessages((prevMessages) => [...prevMessages, message]);
      setNewMessage('');
      setImage(null);
      setImagePreview(null);

      const userId = localStorage.getItem('userId');
      if (!userId) {
        setError('User is not authenticated!');
        return;
      }

      // Send the message to the socket
      socket.current?.emit('send_message', {
        sender: userId,
        receiver: selectedUser?.id,
        content: newMessage.trim(),
        senderModel: 'Instructor',
        receiverModel: 'User',
        image: message.image,
      });

    }
  };

  const handleUserSelect = async (user: Instructor) => {
    setSelectedUser(user);
    setLoading(true);
    try {
      const userId = localStorage.getItem('userId');
      if (socket.current && userId) {
        socket.current.emit('joinChatRoom', {
          sender: userId,
          receiver: user.id,
        });
      }
      const response = await api.get('/messages', {
        params: {
          senderId: userId,
          receiverId: user.id,
        },
      });
      const fetchedMessages = response.data.map((message: any) => ({
        sender: message.sender === userId ? 'self' : 'other',
        text: message.content || '',
        time: new Date(message.createdAt).toLocaleTimeString(),
        mediaUrl: message.mediaUrl,
      }));
      setMessages(fetchedMessages);
    } catch (err) {
      setError('Failed to fetch messages. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);

      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    }
  };

  const submitImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "images_preset");
    formData.append("cloud_name", "dazdngh4i");

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dazdngh4i/image/upload",
        formData
      );
      return res.data.url;
    } catch (error: any) {
      console.error("Cloudinary error:", error.response?.data || error.message);
      setError(`Error uploading image: ${error.response?.data?.message || error.message}`);
      return "";
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-indigo-100 to-purple-200">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-purple-600 to-indigo-800 text-white flex flex-col">
        <Typography variant="h6" className="p-4 font-bold text-white">
          {userType === 'Instructor' ? 'User' : 'Instructor'}
        </Typography>
        <div className="flex p-4">
          <TextField
            fullWidth
            placeholder={`Search ${userType === 'Instructor' ? 'User' : 'Instructor'}...`}
            variant="outlined"
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </div>
        <List>
          {filteredUsers.map((user) => (
            <ListItem key={user.id} button onClick={() => handleUserSelect(user)} selected={selectedUser?.id === user.id}>
              <ListItemAvatar>
                <Badge color="success" variant="dot">
                  <Avatar alt={user.name} src={user.image} />
                </Badge>
              </ListItemAvatar>
              <ListItemText primary={user.name} />
            </ListItem>
          ))}
        </List>
      </aside>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-indigo-100 to-purple-50 p-4 flex items-center border-b">
          {selectedUser ? (
            <>
              <Avatar src={selectedUser.image} />
              <div className="ml-3">
                <Typography variant="h6" className="font-bold text-gray-900">
                  {selectedUser.name}
                </Typography>
                <Typography variant="caption" className="text-gray-500">
                  Active
                </Typography>
              </div>
            </>
          ) : (
            <Typography>No tutor selected</Typography>
          )}
        </div>

        {/* Messages Area */}
        <div className="flex-1 p-4 overflow-y-auto">
          <List>
            {messages.map((message, index) => (
              <div
                key={index}
                style={{
                  textAlign: message.sender === 'self' ? 'right' : 'left',
                  margin: '10px 0',
                }}
              >
                {message.mediaUrl && (
                  <img
                    src={message.mediaUrl}
                    alt="Media"
                    className="w-24 h-24 object-cover"
                    style={{
                      borderRadius: '8px',
                      margin: message.sender === 'self' ? '0 auto 0 0' : '0 0 0 auto',
                    }}
                  />
                )}
                {message.text && (
                  <ListItemText
                    primary={message.text}
                    secondary={message.time}
                  />
                )}
              </div>
            ))}
          </List>
        </div>
        {/* Message Input */}
        <div className="flex items-center p-4 border-t">
          <TextField
            fullWidth
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message"
            variant="outlined"
            multiline
            rows={2}
          />
          <Tooltip title="Attach Image">
            <IconButton onClick={() => imageInputRef.current?.click()}>
              <AttachFile />
            </IconButton>
          </Tooltip>
          <IconButton onClick={handleSendMessage}>
            <Send />
          </IconButton>

          {/* Hidden file input */}
          <input
            type="file"
            ref={imageInputRef}
            style={{ display: 'none' }}
            accept="image/*"
            onChange={handleFileUpload}
          />

          {/* Image preview */}
          {imagePreview && (
            <div>
              <img src={imagePreview} alt="Image Preview" className="w-24 h-24 object-cover mt-2" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TutorChatInterface;
