import React, { useState, useEffect, useRef } from 'react';
import { Avatar, TextField, IconButton, Typography, Badge, List, ListItem, ListItemAvatar, ListItemText, InputAdornment, Tooltip, CircularProgress, LinearProgress } from '@mui/material';
import { Send, VideoCall, Mic, Stop, Search, AttachFile, Delete } from '@mui/icons-material';
import { Check, DoneAll } from '@mui/icons-material';
import api from '../../../infrastructure/api/api';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';
import EmojiPicker from 'emoji-picker-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface User {
  id: string;
  name: string;
  image: string;
}

interface Message {
  messageId: string;
  sender: 'self' | 'other';
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

const StudentChatInterface: React.FC<Props> = ({ userType = 'User' }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
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

  useEffect(() => {
    socket.current = io('http://localhost:5000', {
      transports: ['websocket'],
      withCredentials: true,
    });

    socket.current.on('receive_message', (message: Message) => {
      if (message.sender !== userId) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
      if (message.messageId) {
        socket.current?.emit('message_read', message.messageId);
        console.log(message, "hii message in read")
      }
    });

    socket.current.on('error', (error: string) => {
      console.error("Socket error:", error);
      toast.error(`Socket Error: ${error}`);
    });

    socket.current.on('message_read_update', (updatedMessage: { id: string; status: 'read' }) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.messageId === updatedMessage.id ? { ...msg, status: updatedMessage.status } : msg
        )
      );
      console.log(updatedMessage, "hii updatedMessage in read update")
    });

    return () => {
      socket.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        setLoading(true);
        const response = await api.get('/user/my-tutors');
        const data = response.data.map((item: any) => ({
          id: item.tutorId._id,
          name: item.tutorId.username,
          image: `http://localhost:5000/${item.tutorId.image}`,
        }));
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

      const message: Message = {
        messageId: `${Date.now()}`,
        sender: 'self',
        content: newMessage || (mediaType === 'audio' ? 'Audio Message' : ''),
        time: new Date().toLocaleTimeString(),
        mediaUrl: mediaUrl ? { url: mediaUrl, type: mediaType } : undefined,
        status: 'sent',
      };

      setMessages((prevMessages) => [...prevMessages, message]);
      setNewMessage('');
      setImage(null);
      setImagePreview(null);

      const userId = localStorage.getItem('userId');
      if (!userId) {
        toast.error('User is not authenticated!');
        return;
      }

      socket.current?.emit('send_message', {
        sender: userId,
        receiver: selectedUser?.id,
        content: newMessage.trim() || (mediaType === 'audio' ? 'Audio Message' : ''),
        senderModel: 'User',
        receiverModel: 'Instructor',
        mediaUrl: message.mediaUrl,
        messageId: message.messageId,
      });
    }
  };

  const handleDeleteAudio = () => {
    setAudioBlob(null);
    setAudioUrl(null);
  };

  const handleUserSelect = async (user: User) => {
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
        sender: message.senderModel === 'User' ? 'self' : 'other',
        content: message.content || '',
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

  const handleVideoCallClick = async (user: User) => {
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
    <div className="flex min-h-screen bg-gradient-to-r from-indigo-100 to-purple-200">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-blue-600 to-green-800 text-white flex flex-col p-4 space-y-4">
        <Typography variant="h6" className="font-bold text-white">
          {userType === 'User' ? 'User' : 'Instructor'}
        </Typography>
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
        <div className="overflow-y-auto space-y-2">
          {filteredUsers.map((user) => (
            <ListItem
              button
              key={user.id}
              onClick={() => handleUserSelect(user)}
              className="bg-green-600 rounded-md transition-colors"
            >
              <ListItemAvatar>
                <Avatar src={user.image} />
              </ListItemAvatar>
              <ListItemText primary={user.name} />
            </ListItem>
          ))}
        </div>
      </aside>

      {/* Main chat area */}
      <main className="flex-1 p-4 flex flex-col">
        <div className="flex justify-between items-center border-b pb-2 mb-2">
          <Typography variant="h6" className="flex items-center">
            <Avatar src={selectedUser?.image} className="mr-2" />
            {selectedUser?.name}
          </Typography>
          <Tooltip title="Video Call">
            <IconButton onClick={() => handleVideoCallClick(selectedUser!)} aria-label="video call">
              <VideoCall />
            </IconButton>
          </Tooltip>
        </div>

        {/* Message list with scroll */}
        <div
          className="flex-1 overflow-y-auto p-4 bg-white rounded-lg shadow-md space-y-2"
          style={{ maxHeight: 'calc(100vh - 200px)' }}
        >
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.sender === 'self' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-lg ${message.sender === 'self' ? 'bg-blue-500 text-white' : 'bg-gray-300'} p-2 rounded-lg`}>
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
                  {message.status == 'read' && <DoneAll style={{ color: 'blue' }} />}
                  {message.status == 'sent' && <Check />}
                  {message.status != 'read' && message.status != 'sent' && <DoneAll />}
                </div>

              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message input area */}
        <div className="flex items-center space-x-2 mt-4">
          <TextField
            variant="outlined"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            fullWidth
            placeholder="Type a message"
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
                top: '500px',
                bottom: '20px',
                left: '210px',
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
          {/* Image Preview Section */}
          {imagePreview && (
            <div className="mt-2 flex justify-center items-center relative">
              {/* Image Preview */}
              <img src={imagePreview} alt="preview" className="rounded-lg" style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'cover' }}
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
      </main>
    </div>
  );
};

export default StudentChatInterface;
