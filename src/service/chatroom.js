/* eslint-disable import/no-duplicates */
import Chatroom from '../db/model/chatRoom';

export default {
  createRoomMessage: async (room, messages, name) => {
    const roomMessage = new Chatroom({
      roomName: room, name, message: messages, username: name,
    });
    roomMessage.save();
  },
  getMessageByRoomName: async (name) => {
    const messages = Chatroom.find({ roomName: name });
    return messages;
  },
  fetchAllRooms: async () => {
    const rooms = Chatroom.find();
    await rooms.select('roomName');
    return rooms;
  },
};
