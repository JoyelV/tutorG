import React, { useState } from 'react';
import {
  Avatar,
  TextField,
  IconButton,
  Badge,
  Typography,
  Slide,
  Box,
} from '@mui/material';
import { Send, VideoCall, Mic, Search } from '@mui/icons-material';
import { FiMoreHorizontal } from 'react-icons/fi';
import Sidebar from '../../components/instructor/Sidebar';
import DashboardHeader from '../../components/instructor/DashboardHeader';

interface User {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  active: boolean;
}

interface Message {
  sender: string;
  text: string;
  time: string;
}

const ChatApp: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const users: User[] = [
    { id: 1, name: 'Jane Cooper', lastMessage: 'Yeah sure, tell me Zafor', time: 'just now', active: true },
    { id: 2, name: 'Jenny Wilson', lastMessage: 'Thank you so much, sir', time: '2 d', active: false },
    { id: 3, name: 'Marvin McKinney', lastMessage: "You're Welcome", time: '1 m', active: true },
    { id: 4, name: 'Eleanor Pena', lastMessage: 'Thank you so much, sir', time: '1 m', active: true },
    { id: 5, name: 'Ronald Richards', lastMessage: "Sorry, I can't help you", time: '2 m', active: false },
    { id: 6, name: 'Kathryn Murphy', lastMessage: 'new message', time: '6 m', active: false },
  ];

  const messages: Message[] = [
    { sender: 'Jane Cooper', text: 'Hello and thanks for signing up for the course...', time: 'Today' },
    { sender: 'Zafor', text: 'Hello, Good Evening.', time: 'Time' },
    { sender: 'Zafor', text: 'I only have a small doubt about your lecture...', time: 'Time' },
    { sender: 'Jane Cooper', text: 'Yeah sure, tell me Zafor.', time: 'Time' },
  ];

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-indigo-100 to-purple-200">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-purple-600 to-indigo-800 text-white flex flex-col">
        <Sidebar />
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Fixed Dashboard Header */}
        <div className="sticky top-0 z-10 bg-white shadow-md">
          <DashboardHeader />
        </div>

        {/* Main Chat Layout */}
        <div className="flex flex-grow">
          {/* User List Section */}
          <div className="w-1/4 bg-white border-r overflow-y-auto">
            <header className="p-4 border-b">
              <Typography variant="h6" className="font-bold text-gray-700">
                Chats
              </Typography>
              <Box display="flex" alignItems="center" mt={2}>
                <Search style={{ marginRight: 8, color: '#6B7280' }} />
                <TextField
                  size="small"
                  fullWidth
                  placeholder="Search users..."
                  variant="outlined"
                  onChange={(e) => setSearchTerm(e.target.value)}
                  inputProps={{ style: { background: '#F3F4F6', borderRadius: '8px' } }}
                />
              </Box>
            </header>

            {filteredUsers.map((user) => (
              <Slide
                direction="right"
                in={true}
                mountOnEnter
                unmountOnExit
                timeout={300}
                key={user.id}
              >
                <div
                  onClick={() => setSelectedUser(user)}
                  className={`flex items-center p-4 cursor-pointer hover:bg-gray-100 transition duration-300 ease-in-out ${
                    selectedUser?.id === user.id ? 'bg-indigo-50' : ''
                  }`}
                >
                  <Badge
                    color={user.active ? 'success' : 'default'}
                    variant="dot"
                    overlap="circular"
                  >
                    <Avatar alt={user.name} />
                  </Badge>
                  <div className="ml-3 flex-1">
                    <Typography className="text-sm font-medium text-gray-900 truncate">
                      {user.name}
                    </Typography>
                    <Typography className="text-xs text-gray-500 truncate">
                      {user.lastMessage}
                    </Typography>
                  </div>
                  <Typography className="text-xs text-gray-400">{user.time}</Typography>
                </div>
              </Slide>
            ))}
          </div>

          {/* Chat Area Section */}
          <div className="w-3/4 flex flex-col">
            {/* Chat Header */}
            <div className="flex items-center p-4 border-b bg-gradient-to-r from-indigo-50 to-purple-50">
              {selectedUser ? (
                <>
                  <Avatar />
                  <div className="ml-3">
                    <Typography variant="h6" className="font-bold text-gray-800">
                      {selectedUser.name}
                    </Typography>
                    <Typography variant="caption" className="text-gray-500">
                      Active {selectedUser.time}
                    </Typography>
                  </div>
                  <FiMoreHorizontal className="ml-auto text-gray-500 cursor-pointer" />
                </>
              ) : (
                <Typography variant="h6" className="text-gray-500 mx-auto">
                  Select a user to start chatting
                </Typography>
              )}
            </div>

            {/* Messages Section */}
            <div className="flex-grow p-4 space-y-4 overflow-y-auto bg-gradient-to-b from-purple-50 to-indigo-50">
              {selectedUser &&
                messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.sender === 'Zafor' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`p-3 rounded-lg max-w-xs shadow-md ${
                        message.sender === 'Zafor'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      <Typography variant="body2">{message.text}</Typography>
                    </div>
                  </div>
                ))}
            </div>

            {/* Input Section */}
            <div className="flex items-center p-4 border-t bg-gradient-to-t from-purple-50 to-indigo-50">
              <TextField
                fullWidth
                size="small"
                placeholder="Type your message"
                className="bg-gray-100 rounded-full"
              />
              <IconButton>
                <VideoCall color="primary" />
              </IconButton>
              <IconButton>
                <Mic color="primary" />
              </IconButton>
              <IconButton>
                <Send color="primary" />
              </IconButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
