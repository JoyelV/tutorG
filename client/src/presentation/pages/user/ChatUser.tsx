import React, { useState } from 'react';
import {
  Avatar,
  TextField,
  IconButton,
  Typography,
  Badge,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  InputAdornment,
  Tooltip,
} from '@mui/material';
import { Send, VideoCall, Mic, Search, Call, Videocam } from '@mui/icons-material';

interface Message {
  sender: 'student' | 'tutor';
  text: string;
  time: string;
}

const ChatUI: React.FC = () => {
  const tutors = [
    { name: 'Jane Cooper', active: true, lastSeen: 'Active Now' },
    { name: 'Jenny Wilson', active: false, lastSeen: 'Last seen: 2 hours ago' },
    { name: 'Marvin McKinney', active: false, lastSeen: 'Last seen: Yesterday' },
  ];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTutor, setSelectedTutor] = useState(tutors[0]);
  const [messages, setMessages] = useState<Message[]>([{
    sender: 'tutor',
    text: `Hi! I'm ${selectedTutor.name}, how can I assist you today?`,
    time: new Date().toLocaleTimeString(),
  }]);

  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        { sender: 'student', text: newMessage, time: new Date().toLocaleTimeString() },
      ]);
      setNewMessage('');
    }
  };

  const handleTutorSelect = (tutor: typeof tutors[0]) => {
    setSelectedTutor(tutor);
    setMessages([
      {
        sender: 'tutor',
        text: `Hi! I'm ${tutor.name}, how can I assist you today?`,
        time: new Date().toLocaleTimeString(),
      },
    ]);
  };

  const filteredTutors = tutors.filter((tutor) =>
    tutor.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen p-4 bg-gray-50">
      {/* Left Pane: Tutor List with Search */}
      <div className="w-1/3 border-r bg-gray-100 rounded-lg shadow-md">
        <div className="p-4">
          <Typography variant="h6" className="font-bold text-gray-800">
            Tutors
          </Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="Search tutors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            className="mt-2"
          />
        </div>
        <List>
          {filteredTutors.map((tutor, index) => (
            <ListItem
              button
              key={index}
              className={`hover:bg-gray-200 ${selectedTutor.name === tutor.name ? 'bg-gray-300' : ''
                }`}
              onClick={() => handleTutorSelect(tutor)}
            >
              <ListItemAvatar>
                <Badge
                  color={tutor.active ? 'success' : 'default'}
                  overlap="circular"
                  variant="dot"
                >
                  <Avatar alt={tutor.name} />
                </Badge>
              </ListItemAvatar>
              <ListItemText
                primary={tutor.name}
                secondary={tutor.lastSeen}
                primaryTypographyProps={{ fontWeight: 'bold' }}
              />
            </ListItem>
          ))}
        </List>
      </div>

      {/* Right Pane: Chat Area */}
      <div className="w-2/3 flex flex-col bg-white rounded-lg shadow-md">
        {/* Chat Header */}
        <div className="flex items-center border-b p-4 bg-blue-100 rounded-t-lg">
          <Badge
            color={selectedTutor.active ? 'success' : 'default'}
            overlap="circular"
            variant="dot"
          >
            <Avatar alt={selectedTutor.name} />
          </Badge>
          <div className="ml-3">
            <Typography variant="h6" className="font-bold text-blue-800">
              {selectedTutor.name}
            </Typography>
            <Typography variant="caption" className="text-gray-500">
              {selectedTutor.lastSeen}
            </Typography>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-blue-50 rounded-b-lg">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.sender === 'student' ? 'justify-end' : 'justify-start'
                }`}
            >
              <div
                className={`p-3 rounded-lg max-w-md shadow-md ${message.sender === 'student'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-800'
                  }`}
              >
                <p className="text-sm">{message.text}</p>
                <p className="text-xs mt-1 text-right italic">{message.time}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="border-t p-4 flex items-center bg-blue-100">
          <TextField
            fullWidth
            size="small"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            className="bg-white rounded-full"
          />
          <IconButton color="primary" onClick={handleSendMessage} className="ml-2">
            <Send />
          </IconButton>
          <IconButton>
            <VideoCall color="primary" />
          </IconButton>
          <IconButton>
            <Mic color="primary" />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default ChatUI;
