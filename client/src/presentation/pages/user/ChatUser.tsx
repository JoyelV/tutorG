import React, { useState, useEffect, useRef } from 'react';
import { Avatar, TextField, IconButton, Typography, Badge, ListItem, List, ListItemAvatar, ListItemText, InputAdornment, Tooltip, CircularProgress, LinearProgress, Box } from '@mui/material';
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
  onlineStatus: boolean;
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
  const [lastMessages, setLastMessages] = useState<{ [userId: string]: { content: string; time: string } }>({});

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
        setUnreadCounts((prevCounts) => ({
          ...prevCounts,
          [message.sender]: (prevCounts[message.sender] || 0) + 1,
        }));
        setLastMessages((prevLastMessages) => ({
          ...prevLastMessages,
          [message.sender]: { content: message.content, time: message.time },
        }));
      }

      setMessages((prevMessages) =>
        prevMessages.some((msg) => msg.messageId === message.messageId)
          ? prevMessages
          : [...prevMessages, message]
      );

      if (message.messageId) {
        socket.current?.emit('message_read', message.messageId);
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
          image: item.tutorId.image,
          onlineStatus: item.tutorId.onlineStatus,
        }));
        setUsers(data);
        const lastMessagesMap: { [userId: string]: { content: string; time: string } } = {};
        await Promise.all(
          data.map(async (tutor: User) => {
            try {
              const userId = localStorage.getItem('userId');
              if (!userId) throw new Error('User not logged in');

              const messageResponse = await api.get('/user/messages', {
                params: {
                  senderId: userId,
                  receiverId: tutor.id,
                },
              });
              const messages = messageResponse.data;
              if (messages.length > 0) {
                const lastMessage = messages[messages.length - 1];
                lastMessagesMap[tutor.id] = {
                  content: lastMessage.content || '',
                  time: lastMessage.createdAt || '',
                };
              } else {
                lastMessagesMap[tutor.id] = { content: '', time: '' };
              }
            } catch (error) {
              lastMessagesMap[tutor.id] = { content: '', time: '' };
            }
          })
        );

        setLastMessages(lastMessagesMap);
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

  useEffect(() => {
    setLastMessages((prev) => {
      const sorted = { ...prev };
      Object.keys(sorted).forEach((key) => {
        if (!sorted[key].time) sorted[key].time = new Date(0).toLocaleTimeString();
      });
      return sorted;
    });
  }, [users, lastMessages]);

  useEffect(() => {
    if (selectedUser) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage) {
        setLastMessages((prev) => ({
          ...prev,
          [selectedUser.id]: {
            content: lastMessage.content,
            time: lastMessage.time,
          },
        }));
      }
    }
  }, [messages, selectedUser]);

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
        content: newMessage || (mediaType === 'audio' ? 'Audio Message' : mediaType),
        time: new Date().toISOString(),
        mediaUrl: mediaUrl ? { url: mediaUrl, type: mediaType } : undefined,
        status: 'sent',
      };

      setMessages((prevMessages) => [...prevMessages, message]);
      setNewMessage('');
      setImage(null);
      setImagePreview(null);

      if (!userId) {
        toast.error('User is not authenticated!');
        return;
      }

      socket.current?.emit('send_message', {
        sender: userId,
        receiver: selectedUser?.id,
        content: newMessage.trim() || (mediaType === 'audio' ? 'Audio Message' : mediaType),
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

      const response = await api.get('/user/messages', {
        params: {
          senderId: userId,
          receiverId: user.id,
        },
      });
      const fetchedMessages = response.data.map((message: any) => ({
        sender: message.sender,
        content: message.content || '',
        status: message.status,
        time: message.createdAt,
        mediaUrl: message.mediaUrl,
      }));
      setMessages(fetchedMessages);

      if (fetchedMessages.length > 0) {
        const lastMessage = fetchedMessages[fetchedMessages.length - 1];

        setLastMessages((prevLastMessages) => ({
          ...prevLastMessages,
          [user.id]: {
            content: lastMessage.content,
            time: lastMessage.time,
          },
        }));
      }
    } catch (err) {
      setError('Failed to fetch messages. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const timeA = lastMessages[a.id]?.time ? new Date(lastMessages[a.id]?.time).getTime() : 0;
    const timeB = lastMessages[b.id]?.time ? new Date(lastMessages[b.id]?.time).getTime() : 0;
    return timeB - timeA;
  });

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
    <div className="flex min-h-screen bg-gradient-to-r from-indigo-100 to-purple-200">
      {/* Sidebar */}
      <aside
        className="bg-gradient-to-b from-yellow-400 to-blue-300 text-white flex flex-col p-4 space-y-4"
        style={{
          width: '340px',
          height: '100vh',
          overflowY: 'auto',
        }}
      >
        <Box
          sx={{
            width: '300px',
            height: '100vh',
            overflowY: 'auto',
          }}
        >
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

          <List style={{ maxHeight: '100%', overflowY: 'auto', padding: '0 10px' }}>
            {sortedUsers.map((user) => (
              <ListItem
                key={user.id}
                onClick={() => handleUserSelect(user)}
                style={{
                  borderBottom: '1px solid #f0f0f0',
                  padding: '10px',
                }}
              >
                <ListItemAvatar>
                  <Avatar src={user.image} style={{ width: '50px', height: '50px' }} />
                </ListItemAvatar>

                <ListItemText
                  primary={
                    <div>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        style={{ marginBottom: '4px' }}
                      >
                        <Typography style={{ fontWeight: 'bold', fontSize: '16px' }}>{user.name}</Typography>
                        <Tooltip title="Video Call">
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              handleVideoCallClick(user);
                            }}
                            style={{ marginLeft: '10px' }}
                          >
                            <VideoCall style={{ color: '#4caf50' }} />
                          </IconButton>
                        </Tooltip>
                      </Box>

                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography
                          variant="body2"
                          noWrap
                          style={{
                            color: '#FFFFFF',
                            maxWidth: '70%',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {lastMessages[user.id]?.content || 'No messages yet'}
                        </Typography>
                        <Typography
                          variant="caption"
                          style={{
                            color: '#FFFFFF',
                            whiteSpace: 'nowrap',
                            marginLeft: '10px',
                          }}
                        >
                          {lastMessages[user.id]?.time && (() => {
                            const messageTime = new Date(lastMessages[user.id]?.time);
                            const now = new Date();
                            const isToday =
                              messageTime.getDate() === now.getDate() &&
                              messageTime.getMonth() === now.getMonth() &&
                              messageTime.getFullYear() === now.getFullYear();

                            return isToday
                              ? messageTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                              : messageTime.toLocaleDateString('en-GB');
                          })()}

                        </Typography>
                        <Badge
                          badgeContent={unreadCounts[user.id] || 0}
                          color="secondary"
                          invisible={unreadCounts[user.id] === 0}
                        />
                      </Box>
                    </div>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </aside>

      {/* Main chat area */}
      <main className="flex-1 p-4 flex flex-col">
        <div className="bg-gradient-to-r from-blue-700 to-green-700 p-4 flex items-center border-b">
          {selectedUser ? (
            <>
              <Avatar src={selectedUser.image} />
              <div className="ml-3">
                <Typography variant="h6" className="font-bold">
                  {selectedUser.name}
                </Typography>
                <Typography variant="h6" className="font-bold">
                  <div>
                    <span
                      style={{
                        height: "15px",
                        width: "15px",
                        borderRadius: "100%",
                        display: "inline-block",
                        backgroundColor: selectedUser.onlineStatus ? "green" : "red",
                        marginRight: "5px",
                      }}
                    ></span>
                    {selectedUser.onlineStatus === true ? "Online" : "Offline"}
                  </div>
                </Typography>
              </div>
            </>
          ) : (
            <Typography>Select an Instructor to start chatting</Typography>
          )}
        </div>

        {/* Message list with scroll */}
        <div
          className="flex-1 overflow-y-auto p-4 bg-white rounded-lg shadow-md space-y-2"
          style={{ maxHeight: 'calc(100vh - 200px)' }}
        >
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.sender === userId ? 'justify-end' : (selectedUser?.id === message.sender ? 'justify-start' : '')}`}>
              <div className={`max-w-lg ${message.sender === userId ? 'bg-blue-500 text-white' : 'bg-gray-300'} p-2 rounded-lg`}>
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
                  <span>
                    {(() => {
                      const messageTime = new Date(message.time);
                      const day = String(messageTime.getDate()).padStart(2, '0');
                      const month = String(messageTime.getMonth() + 1).padStart(2, '0'); 
                      const year = String(messageTime.getFullYear()).slice(-2); 
                      const hours = String(messageTime.getHours()).padStart(2, '0');
                      const minutes = String(messageTime.getMinutes()).padStart(2, '0');
                      return `${day}/${month}/${year} ${hours}:${minutes}`;
                    })()}
                  </span>

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
