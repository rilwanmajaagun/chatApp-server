/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
import status from 'http-status';
import User from '../service/user';

export default {
  friendship: async (req, res, next) => {
    try {
      const { email } = res.locals.user;
      const { _id } = req.body;
      const alreadyFriends = await User.checkIfFriends(email, _id);
      if (alreadyFriends) {
        return res.status(status.BAD_REQUEST).send({
          message: 'ALREADY FRIENDS',
        });
      }
      next();
    } catch (error) {
      console.log('error', error);
      return res.status(status.INTERNAL_SERVER_ERROR).send({
        message: status[500],
      });
    }
  },
};
