import React from 'react';
import { List, ListItem, ListItemAvatar, ListItemText, Avatar } from '@mui/material';

interface User {
  id: string;
  name: string;
  image: string;
  onlineStatus: boolean;
}

interface Props {
  users: User[];
  selectedUser: User | null;
  onUserSelect: (user: User) => void;
}

const UserList: React.FC<Props> = ({ users, selectedUser, onUserSelect }) => (
  <List>
    {users.map((user) => (
      <ListItem
        key={user.id}
        selected={selectedUser?.id === user.id}
        onClick={() => onUserSelect(user)}
        button
      >
        <ListItemAvatar>
          <Avatar src={user.image} />
        </ListItemAvatar>
        <ListItemText primary={user.name} secondary={user.onlineStatus ? 'Online' : 'Offline'} />
      </ListItem>
    ))}
  </List>
);

export default UserList;
