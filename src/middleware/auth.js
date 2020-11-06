/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
import status from 'http-status';
import hash from '../utils/hash';

export default {
  verifyUser: async (req, res, next) => {
    const token = req.query.token || req.headers.token;
    try {
      if (!token) {
        return res.status(status.BAD_REQUEST).send({
          message: 'token not provided',
        });
      }
      const decoded = await hash.verifyToken(token);
      req.user = {
        id: decoded.id,
        email: decoded.email,
        username: decoded.username,
      };
      res.locals.user = req.user;
      next();
    } catch (error) {
      return res.status(status.FORBIDDEN).send({
        message: 'forbidden',
      });
    }
  },
};
