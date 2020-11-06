/* eslint-disable import/no-cycle */
/* eslint-disable no-param-reassign */
import momment from 'moment';
import server from '../index';
import chat from '../service/chat';
import chatroom from '../service/chatroom';

// const sockets = {};
const connectedUsers = {};

export default (socket) => {
  // keep record of all connected users
  socket.on('logged-in', (userId) => {
    connectedUsers[userId] = socket.id;
    // console.log('connected user');
  });

  // fetch all general message
  socket.on('general.room', () => {
    chat.generalMessages()
      .then((result) => {
        server.io.emit('All.general.message', result);
      });
  });

  // send new general message
  socket.on('new.message', (data) => {
    chat.generalMessage(data);
    server.io.emit('general.message', { ...data, createdAt: momment().format('YYYY-MM-DDTHH:mm:ss') });
  });

  // show a user is online
  socket.on('userName.isOnline', (data) => {
    socket.username = data;
    socket.broadcast.emit('isOnline', {
      message: `${socket.username} is online`,
      user: socket.username,
    });
  });

  // join room
  socket.on('join', async ({ name, room }) => {
    // name = name.trim().toLowerCase();
    // room = room.trim().toLowerCase();
    const roomMessages = await chatroom.getMessageByRoomName(room);
    socket.emit('roomMessages', roomMessages);
    socket.emit('message', { user: `${name} Welcome to the room ${room}` });
    socket.broadcast.to(room).emit('message', { user: `${name} joined!` });
    socket.join(room);
  });

  // leave room
  socket.on('leave.room', (data) => {
    socket.broadcast.to(data.room).emit('message', { user: `${data.name} leaves!` });
    socket.leave(data.room);
  });

  // send message to the room.
  socket.on('room.message', async ({ name, room, messages }) => {
    chatroom.createRoomMessage(room, messages, name);
    server.io.to(room).emit('new.room.message', { username: name, room, message: messages });
  });

  // send private message
  socket.on('private-message', (data) => {
    const { receiverId, senderId, message } = data;
    chat.sendPrivateMessage(data);
    chat.receivePrivateMessage(data);
    server.io
      .to(connectedUsers[receiverId])
      .emit('private-message', {
        _id: senderId,
        receiverId,
        message,
        date: momment().format('YYYY-MM-DDTHH:mm:ss'),
      });
  });
  // disconnect
  socket.on('disconnect', () => {
    console.log('user is disconnected');
  });
};
