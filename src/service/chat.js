import mongoose from 'mongoose';
import GeneralMessage from '../db/model/generalMessage';
import User from '../db/model/user';

const { ObjectId } = mongoose.Types;

export default {
  generalMessage: async ({ message, sender }) => {
    const genMessage = new GeneralMessage({
      message, sender,
    });
    genMessage.save();
  },
  generalMessages: async () => {
    const messages = GeneralMessage.find();
    return messages;
  },
  sendPrivateMessage: async ({ message, senderId, receiverId }) => {
    const user = await User.findOne({ _id: new ObjectId(senderId) });
    user.sentMessage.push({
      receiverId,
      message,
    });
    user.save();
  },
  receivePrivateMessage: async ({ message, senderId, receiverId }) => {
    const user = await User.findOne({ _id: new ObjectId(receiverId) });
    user.receivedMessage.push({
      senderId,
      message,
    });
    user.save();
  },
  fetchSentPrivateMessage: async (senderId, receiverId) => {
    const user = await User.findOne({ _id: new ObjectId(senderId) });
    const messages = user.sentMessage.filter((obj) => String(obj.receiverId) === receiverId);
    return messages;
  },
  fetchReceivePrivateMessage: async (senderId, receiverId) => {
    const user = await User.findOne({ _id: new ObjectId(senderId) });
    const message = user.receivedMessage.filter((obj) => String(obj.senderId) === receiverId);
    const sortMessage = message.sort((a, b) => b.date - a.date);
    return sortMessage;
  },
};
