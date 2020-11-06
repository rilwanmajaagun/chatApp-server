import mongoose from 'mongoose';

const { Schema } = mongoose;

const chatRoomSchema = new Schema({
  roomName: {
    type: String,
  },
  message: {
    type: String,
  },
  username: {
    type: String,
  },
},
{
  timestamps: true,
});
export default mongoose.model('Chatroom', chatRoomSchema);
