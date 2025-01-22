import React from 'react';
import { Box, Typography } from '@mui/material';

interface Message {
  sender: string;
  content: string;
  time: string;
  mediaUrl?: {
    url: string;
    type: string;
  };
}

interface Props {
  messages: Message[];
}

const MessageList: React.FC<Props> = ({ messages }) => (
  <Box>
    {messages.map((message, index) => (
      <Box key={index} m={2}>
        <Typography variant="body1">{message.content}</Typography>
        {message.mediaUrl && (
          <a href={message.mediaUrl.url} target="_blank" rel="noopener noreferrer">
            {message.mediaUrl.type === 'image' ? 'View Image' : 'Download File'}
          </a>
        )}
        <Typography variant="caption">{message.time}</Typography>
      </Box>
    ))}
  </Box>
);

export default MessageList;
