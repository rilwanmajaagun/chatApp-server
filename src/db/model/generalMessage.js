import mongoose from 'mongoose';

const { Schema } = mongoose;

const GeneralMessageSchema = new Schema({
  message: {
    type: String,
  },
  sender: {
    type: String,
  },
}, {
  timestamps: true,
});

export default mongoose.model('generalMessage', GeneralMessageSchema);
