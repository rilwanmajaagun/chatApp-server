/* eslint-disable no-underscore-dangle */
import mongoose from 'mongoose';
import User from '../db/model/user';

const { ObjectId } = mongoose.Types;

export default {
  checkIfUserExits: async (email) => {
    const existingUser = await User.findOne({ email });
    return existingUser;
  },
  getUserById: async (_id) => {
    const existingUser = await User.findOne({ _id: new ObjectId(_id) });
    return existingUser;
  },
  signup: async (email, username, firstName, lastName, password) => {
    const user = new User({
      email, username, firstName, lastName, password,
    });
    user.save();
  },
  checkUserName: async (username) => {
    const user = await User.findOne({ username });
    return user;
  },
  getAllUser: async (userId) => {
    const allUsers = User.find({ _id: { $ne: userId } });
    await allUsers.select('username firstName lastName');
    return allUsers;
  },
  addToFriends: async (email, _id) => {
    const user = await User.findOne({ email });
    const friend = await User.findOne({ _id: new ObjectId(_id) });
    user.friends.push(friend);
    user.save();
    friend.friends.push(user);
    friend.save();
  },
  checkIfFriends: async (email, _id) => {
    const user = await User.findOne({ email });
    const friend = await User.findOne({ _id: new ObjectId(_id) });
    const alreadyFriends = user.friends.includes(friend._id);
    return alreadyFriends;
  },
  fetchFriends: async (email) => {
    const friends = User.findOne({ email })
      .populate({ path: 'friends', select: 'username email firstName lastName ' })
      .select('username firstName lastName');
    return friends;
  },
  removeFriend: async (email, _id) => {
    const user = await User.findOne({ email });
    const friend = await User.findOne({ _id: new ObjectId(_id) });
    user.friends.pull(_id);
    user.save();
    friend.friends.pull(user);
    friend.save();
  },
};
