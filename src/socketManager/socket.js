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

  // is online
  socket.on('online', (data) => {
    const { receiverId, senderId } = data;
    if (connectedUsers[receiverId]) {
      server.io
        .to(socket.id)
        .emit('online', 'online');
    }
    if (connectedUsers[senderId]) {
      server.io
        .to(connectedUsers[receiverId])
        .emit('online', 'online');
    } else {
      server.io
        .to(connectedUsers[receiverId])
        .emit('online', 'Offline');
    }
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

  // is typing
  socket.on('typing', (data) => {
    const { senderId, receiverId, senderName } = data;
    server.io
      .to(connectedUsers[receiverId])
      .emit('typing', { username: senderName, receiverId, senderId });
  });

  // connecting to webrtc
  socket.on('videoCall', (room) => {
    const myRoom = server.io.sockets.adapter.rooms[room] || { length: 0 };
    const numClients = myRoom.length;
    if (numClients === 0) {
      console.log('heerer');
      socket.join(room);
      socket.emit('created', room);
    } else if (numClients === 1) {
      console.log('herer');
      socket.join(room);
      socket.emit('joined', room);
    } else {
      console.log(numClients, 'full');
      socket.emit('full', room);
    }
  });

  // disable call button
  socket.on('disableCreatCall', (data) => {
    // console.log('hrtdsdtr');
    socket.emit('disableCreatCall', data);
  });

  //
  socket.on('ready', (data) => {
    server.io
      .to(data)
      .emit('ready', data);
  });

  socket.on('offer', (data) => {
    server.io
      .to(data.room)
      .emit('offer', data);
  });

  socket.on('answer', (data) => {
    server.io
      .to(data.room)
      .emit('answer', data);
  });

  socket.on('candidate', (data) => {
    server.io
      .to(data.room)
      .emit('candidate', data.candidate);
  });

  socket.on('sharingScreen', (data) => {
    server.io
      .emit('sharingScreen', data);
  });

  // disconnect
  socket.on('disconnect', () => {
    const keys = Object.keys(connectedUsers).find((k) => connectedUsers[k] === socket.id);
    delete connectedUsers[keys];
    // const users = Object.keys(connectedUsers);
    // users.forEach((id) => {
    //   server.io
    //     .to(id).emit('online', 'offline');
    // });
    socket.emit('online', { senderId: keys });
  });
};
