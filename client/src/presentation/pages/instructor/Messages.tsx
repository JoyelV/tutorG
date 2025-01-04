import React, { useState, useEffect, useRef } from 'react';
import { Avatar, TextField, IconButton, Typography, Badge, List, ListItem, ListItemAvatar, ListItemText, InputAdornment, Tooltip, CircularProgress, LinearProgress } from '@mui/material';
import { Send, VideoCall, Mic, Stop, Search, AttachFile, Delete } from '@mui/icons-material';
import { Check, DoneAll } from '@mui/icons-material';
import api from '../../../infrastructure/api/api';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';
import Sidebar from '../../components/instructor/Sidebar';
import EmojiPicker from 'emoji-picker-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Instructor {
  id: string;
  name: string;
  image: string;
}

interface Message {
  messageId: string;
  sender: string;
  content: string;
  time: string;
  status: string;
  mediaUrl?: {
    url: string;
    type: string;
  };
}

interface Props {
  userType?: 'User' | 'Instructor';
}

const VIDEO_SIZE_LIMIT_MB = 100;

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
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const userId = localStorage.getItem('userId');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileSizeError, setFileSizeError] = useState<string | null>(null);

  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [unreadCounts, setUnreadCounts] = useState<{ [userId: string]: number }>({});


  useEffect(() => {
    socket.current = io(`${process.env.REACT_APP_SOCKET_URL}`, {
      transports: ['websocket'],
      withCredentials: true,
    });

    socket.current.on('receive_message', (message: Message) => {
      if (message.sender !== userId) {
        // Update unread counts if message is not from the selected user
        if (!selectedUser || selectedUser.id !== message.sender) {
          setUnreadCounts((prevCounts) => ({
            ...prevCounts,
            [message.sender]: (prevCounts[message.sender] || 0) + 1,
          }));
        } else{
        setMessages((prevMessages) =>
            prevMessages.some((msg) => msg.messageId === message.messageId)
              ? prevMessages
              : [...prevMessages, message]
          );
        }
      }
    
      // Emit read receipt for any received message
      if (message.messageId) {
        socket.current?.emit('message_read', message.messageId);
      }
    });    

    socket.current.on('error', (error: string) => {
      console.error("Socket error:", error);
    });

    socket.current.on('message_read_update', (updatedMessage: { id: string; status: 'read' }) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.messageId === updatedMessage.id ? { ...msg, status: updatedMessage.status } : msg
        )
      );
    });

    return () => {
      socket.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        setLoading(true);
        const response = await api.get('/instructor/students-chat');
        const studentsMap: { [key: string]: Instructor } = {};
        response.data.forEach((item: any) => {
          const studentId = item.studentId._id.toString();
          if (!studentsMap[studentId]) {
            studentsMap[studentId] = {
              id: studentId,
              name: item.studentId.username,
              image:item.studentId.image,
            };
          }
        });

        const data = Object.values(studentsMap);
        setUsers(data);
        if (data.length > 0) {
          setSelectedUser(data[0]);
          setMessages([{
            messageId: `${Date.now()}`,
            sender: 'other',
            content: `Hi! I'm ${data[0].name}, how can I assist you today?`,
            time: new Date().toLocaleTimeString(),
            status: 'sent'
          }]);
        }
      } catch (err) {
        toast.error('Unable to fetch the list of tutors. Please try again later.');
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

  const handleStartRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        const chunks: Blob[] = [];
        mediaRecorder.ondataavailable = (e) => chunks.push(e.data);

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'audio/webm' });
          setAudioBlob(blob);
          setAudioUrl(URL.createObjectURL(blob));
        };

        mediaRecorder.start();
        setIsRecording(true);
      })
      .catch((err) => {
        toast.error('Failed to access microphone. Please check permissions.');
        console.error(err);
      });
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    const stream = mediaRecorderRef.current?.stream;
    if (stream) {
      stream.getTracks().forEach((track) => {
        if (track.readyState === 'live') {
          track.stop();
        }
      });
    }
    setIsRecording(false);
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() || image || audioBlob) {
      let mediaUrl = '';
      let mediaType = "";

      if (image) {
        mediaUrl = await submitImage(image);
        mediaType = image.type.startsWith("image") ? "image" : "video";
      }

      if (audioBlob) {
        const audioFile = new File([audioBlob], 'audioMessage.webm', { type: 'audio/webm' });
        mediaUrl = await submitImage(audioFile);
        mediaType = 'audio';
        setAudioBlob(null);
        setAudioUrl(null);
      }
      const userId = localStorage.getItem('userId');

      const message: Message = {
        messageId: `${Date.now()}`,
        sender: userId || '',
        content: newMessage || (mediaType === 'audio' ? 'Audio Message' : ''),
        time: new Date().toLocaleTimeString(),
        mediaUrl: mediaUrl ? { url: mediaUrl, type: mediaType } : undefined,
        status: 'sent'
      };

      setMessages((prevMessages) => [...prevMessages, message]);
      setNewMessage('');
      setImage(null);
      setImagePreview(null);

      if (!userId) {
        setError('User is not authenticated!');
        return;
      }

      socket.current?.emit('send_message', {
        sender: userId,
        receiver: selectedUser?.id,
        content: newMessage.trim() || (mediaType === 'audio' ? 'Audio Message' : ''),
        senderModel: 'Instructor',
        receiverModel: 'User',
        mediaUrl: message.mediaUrl,
        messageId: message.messageId,
      });
    }
  };

  const handleDeleteAudio = () => {
    setAudioBlob(null);
    setAudioUrl(null);
  };

  const handleUserSelect = async (user: Instructor) => {
    setSelectedUser(user);
    setUnreadCounts((prevCounts) => ({
      ...prevCounts,
      [user.id]: 0,
    }));
    setLoading(true);
    try {
      const userId = localStorage.getItem('userId');
      if (socket.current && userId) {
        socket.current.emit('joinChatRoom', {
          sender: userId,
          receiver: user.id,
        });
      }
      const response = await api.get('/instructor/messages', {
        params: {
          senderId: userId,
          receiverId: user.id,
        },
      });
      const fetchedMessages = response.data.map((message: any) => ({
        sender: message.sender,
        content: message.content || '',
        status: message.status,
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

  const validateFileSize = (file: File) => {
    const sizeInMB = file.size / (1024 * 1024);
    if (sizeInMB > VIDEO_SIZE_LIMIT_MB) {
      setFileSizeError(`The file is too large. Please upload a video under ${VIDEO_SIZE_LIMIT_MB}MB.`);
      return false;
    }
    setFileSizeError(null);
    return true;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateFileSize(file)) {
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
    const uploadURL = file.type.startsWith("image") ? "/v1_1/dazdngh4i/image/upload" : "/v1_1/dazdngh4i/video/upload";
    try {
      setUploading(true);
      setUploadProgress(0);
      const res = await axios.post(
        `https://api.cloudinary.com${uploadURL}`,
        formData,
        {
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setUploadProgress(progress);
            }
          }
        }
      );
      setUploading(false);
      return res.data.url;
    } catch (error: any) {
      console.error("Cloudinary error:", error.response?.data || error.message);
      toast.error(`Error uploading image: ${error.response?.data?.message || error.message}`);
      return "";
    }
  };

  const handleVideoCallClick = async (user: Instructor) => {
    setSelectedUser(user);
    const roomId = [user.id, userId].sort().join("-");
    const videoCallUrl = `/chat/${roomId}`;
    window.open(videoCallUrl, '_blank');
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <Sidebar />
      </aside>
      {/* Main content area */}
      <div className="flex-1 bg-gray-100">

        <div className="flex min-h-screen bg-gradient-to-r from-indigo-100 to-purple-200">
          {/* Sidebar */}
          <aside className="w-64 bg-gradient-to-b from-yellow-400 to-blue-300 text-black flex flex-col fixed top-0 h-screen z-50">
            <Typography variant="h6" className="p-4 font-bold text-white">
              {userType === 'User' ? 'User' : 'Instructor'}
            </Typography>
            <div className="flex p-4">
              <TextField
                fullWidth
                placeholder={`Search ${userType === 'User' ? 'Instructor' : 'User'}...`}
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
            <div className="overflow-y-auto space-y-2">
              {filteredUsers.map((user) => (
                <ListItem key={user.id} button onClick={() => handleUserSelect(user)} selected={selectedUser?.id === user.id}>
                  <ListItemAvatar>
                    <Badge
                      badgeContent={unreadCounts[user.id] || 0}
                      color="error"
                    >
                      <Avatar src={user.image} alt={user.name} />
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText primary={user.name} />
                  <Tooltip title="Video Call">
                    <IconButton onClick={() => handleVideoCallClick(user)}>
                      <VideoCall />
                    </IconButton>
                  </Tooltip>
                </ListItem>
              ))}
            </div>
          </aside>
          {/* Chat Area */}
          <div className="flex-1 flex flex-col pl-64">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-indigo-100 to-purple-50 p-4 flex items-center border-b">
              {selectedUser ? (
                <>
                  <Avatar src={selectedUser.image} />
                  <div className="ml-3">
                    <Typography variant="h6" className="font-bold">
                      {selectedUser.name}
                    </Typography>
                  </div>
                </>
              ) : (
                <Typography>Select a user to start chatting</Typography>
              )}
            </div>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 max-h-[570px]">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div key={index} className={`flex ${message.sender === userId ? 'justify-end' : (selectedUser?.id === message.sender ? 'justify-start':'') }`}>
              <div className={`max-w-lg ${message.sender === userId  ? 'bg-blue-500 text-white' : 'bg-gray-300'} p-2 rounded-lg`}>
                      <Typography>{message.content}</Typography>
                      {message.mediaUrl && (
                        <>
                          {message.mediaUrl.type === "image" && (
                            <img src={message.mediaUrl.url} alt="Message Media" />
                          )}
                          {message.mediaUrl.type === "video" && (
                            <video controls src={message.mediaUrl.url}></video>
                          )}
                          {message.mediaUrl.type === "audio" && (
                            <video controls src={message.mediaUrl.url} ></video>
                          )}
                        </>
                      )}
                      <div className="flex justify-between text-sm mt-1">
                        <span>{message.time}</span>
                        {message.status === 'read' ? (
                          <DoneAll style={{ color: 'blue' }} />
                        ) : message.status === 'sent' ? (
                          <Check />
                        ) : (
                          <DoneAll />
                        )}
                      </div>

                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>
            {/* Message Input */}
            <div className="bg-gradient-to-r from-indigo-100 to-purple-50 p-4 border-t">
              <div className="flex items-center space-x-2">
                {/* Text Input Field */}
                <TextField
                  fullWidth
                  variant="outlined"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <IconButton onClick={() => setShowEmojiPicker((prev) => !prev)}>
                          😀
                        </IconButton>
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <div className="flex items-center space-x-2">
                          <Tooltip title={isRecording ? "Stop Recording" : "Record Audio"}>
                            <IconButton onClick={isRecording ? handleStopRecording : handleStartRecording}>
                              {isRecording ? <Stop /> : <Mic />}
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Attach Image...">
                            <IconButton
                              onClick={() => imageInputRef.current?.click()}
                              color="primary"
                            >
                              <AttachFile />
                            </IconButton>
                          </Tooltip>
                          {audioBlob && (
                            <>
                              <IconButton onClick={handleDeleteAudio} color="secondary">
                                <Delete />
                              </IconButton>
                            </>
                          )}
                        </div>
                        <IconButton onClick={handleSendMessage}>
                          <Send />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                {showEmojiPicker && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '200px',
                      bottom: '20px',
                      left: '510px',
                    }}
                  >
                    <EmojiPicker
                      onEmojiClick={(emojiData) => {
                        setNewMessage((prevMessage) => prevMessage + emojiData.emoji);
                        setShowEmojiPicker(false);
                      }}
                    />
                  </div>
                )}
              </div>
              {/* Image Preview Section */}
              {imagePreview && (
                <div className="mt-2 flex justify-center items-center relative">
                  {/* Image Preview */}
                  <img src={imagePreview} alt="preview" className="rounded-lg" style={{ maxWidth: '100%', maxHeight: '150px', objectFit: 'cover' }}
                  />

                  {/* Close (X) Button */}
                  <button
                    onClick={() => {
                      setImagePreview(null);
                      setImage(null);
                    }}
                    className="absolute top-0 right-0 p-2 bg-black text-white rounded-full"
                  >
                    X
                  </button>
                </div>
              )}
            </div>
            {/* Attach File Button */}
            <input
              type="file"
              ref={imageInputRef}
              style={{ display: 'none' }}
              onChange={handleFileUpload}
            />
            {/* Progress Bar */}
            {uploading && (
              <LinearProgress variant="determinate" value={uploadProgress} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorChatInterface;