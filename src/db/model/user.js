import mongoose from 'mongoose';

const { Schema } = mongoose;

const UserSchema = new Schema({
  email: String,
  username: String,
  firstName: String,
  lastName: String,
  password: String,
  friends: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  sentMessage: [{
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    message: String,
    date: { type: Date, default: Date.now },
  }],
  receivedMessage: [{
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    message: String,
    date: { type: Date, default: Date.now },
  }],
});

export default mongoose.model('User', UserSchema);
