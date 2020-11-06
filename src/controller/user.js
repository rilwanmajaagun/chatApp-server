/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-cycle */
import status from 'http-status';
import user from '../service/user';
import hash from '../utils/hash';
import chat from '../service/chat';
import chatroom from '../service/chatroom';

export default {
  signup: async (req, res) => {
    try {
      const {
        email,
        username,
        firstName,
        lastName,
        password,
      } = req.body;
      const existingUser = await user.checkIfUserExits(email);
      const name = await user.checkUserName(username);

      if (existingUser) {
        return res.status(status.BAD_REQUEST).send({ message: 'User Already Exist' });
      } if (name) {
        return res.status(status.BAD_REQUEST).send({ message: 'Username ALready Taken' });
      }
      const hashPassword = await hash.hashPassword(password);
      await user.signup(email, username, firstName, lastName, hashPassword);
      return res.status(status.CREATED).send({ message: 'User created successfully. Pls kindly login' });
    } catch (error) {
      return res.status(status.INTERNAL_SERVER_ERROR).send({ message: status[500] });
    }
  },

  login: async (req, res) => {
    try {
      const {
        email,
        password,
      } = req.body;
      const existingUser = await user.checkIfUserExits(email);
      if (existingUser) {
        const { _id, username } = existingUser;
        const match = await hash.comparePassword(password, existingUser.password);
        if (match === true) {
          const token = await hash.generateToken(_id, existingUser.email, username);
          return res.status(status.OK).send({
            id: _id,
            message: 'login successfully',
            username,
            email: existingUser.email,
            token,
          });
        }
        return res.status(status.BAD_REQUEST).send({ message: 'Wrong password' });
      }
      return res.status(status.NOT_FOUND).send({ message: 'User does not exist' });
    } catch (error) {
      return res.status(status.INTERNAL_SERVER_ERROR).send({ message: status[500] });
    }
  },

  getUser: async (req, res) => {
    const { email } = res.locals.user;
    const existingUser = await user.checkIfUserExits(email);
    try {
      const {
        username, firstName, lastName,
        _id,
      } = existingUser;
      return res.status(status.OK).send({
        message: 'hello',
        data: {
          id: _id,
          username,
          email,
          firstName,
          lastName,
        },
      });
    } catch (error) {
      return res.status(status.INTERNAL_SERVER_ERROR).send({
        message: status[500],
      });
    }
  },

  fetchAllUser: async (req, res) => {
    const { id } = res.locals.user;
    try {
      const allUsers = await user.getAllUser(id);
      return res.status(status.OK).send({
        message: 'All user',
        allUsers,
      });
    } catch (error) {
      return res.status(status.INTERNAL_SERVER_ERROR).send({
        message: status[500],
      });
    }
  },

  addAsFriend: async (req, res) => {
    const { email } = res.locals.user;
    try {
      const { _id } = req.body;
      await user.addToFriends(email, _id);
      return res.status(status.CREATED).send({
        message: 'Add as friend',
      });
    } catch (error) {
      return res.status(status.INTERNAL_SERVER_ERROR).send({
        message: status[500],
      });
    }
  },

  fetchFriends: async (req, res) => {
    const { email } = res.locals.user;
    try {
      const result = await user.fetchFriends(email);
      const { friends } = result;
      return res.status(status.OK).send({
        message: 'Your friends',
        friends,
      });
    } catch (error) {
      return res.status(status.INTERNAL_SERVER_ERROR).send({
        message: status[500],
      });
    }
  },

  removeFriend: async (req, res) => {
    const { email } = res.locals.user;
    const { _id } = req.params;
    try {
      await user.removeFriend(email, _id);
      return res.status(status.OK).send({
        message: 'Removed',
      });
    } catch (error) {
      return res.status(status.INTERNAL_SERVER_ERROR).send({
        message: status[500],
      });
    }
  },
  fetchMessage: async (req, res) => {
    const { senderId, receiverId } = req.params;
    try {
      const sentMessage = await chat.fetchSentPrivateMessage(senderId, receiverId);
      const receiveMessage = await chat.fetchReceivePrivateMessage(senderId, receiverId);
      const message = [...sentMessage, ...receiveMessage];
      const sortMessage = message.sort((a, b) => a.date - b.date);
      return res.status(status.OK).send({
        message: 'sent Messages',
        data: sortMessage,
      });
    } catch (error) {
      return res.status(status.INTERNAL_SERVER_ERROR).send({
        message: status[500],
      });
    }
  },
  fetchAllRooms: async (req, res) => {
    try {
      const rooms = await chatroom.fetchAllRooms();
      return res.status(status.OK).send({
        message: 'fetched all rooms',
        data: rooms,
      });
    } catch {
      return res.status(status.INTERNAL_SERVER_ERROR).send({
        message: status[500],
      });
    }
  },
};
