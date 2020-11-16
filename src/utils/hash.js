import 'dotenv/config';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export default {
  hashPassword: (password) => {
    const saltRound = process.env.SALT;
    const salt = bcrypt.genSaltSync(saltRound);
    const hash = bcrypt.hash(password, salt);
    return hash;
  },
  comparePassword: (password, hash) => {
    const match = bcrypt.compare(password, hash);
    return match;
  },
  generateToken: async (id, email, username) => {
    const key = process.env.SECRET_KEY;
    const token = jwt.sign({
      id,
      email,
      username,
    }, key, { expiresIn: '24h' });
    return token;
  },
  verifyToken: async (token) => {
    try {
      const decode = jwt.verify(token, process.env.SECRET_KEY);
      return decode;
    } catch (error) {
      return Promise.reject(error);
    }
  },
};
