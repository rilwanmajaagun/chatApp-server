/* eslint-disable import/no-cycle */
import mongoose from 'mongoose';
import { logger } from '../config';

const dbUrl = process.env.DB_URL;

const connect2db = async () => {
  mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });
  const db = mongoose.connection;
  db.on('error', logger.error.bind(logger, 'connection error'));
  const connected = await db.once('open', () => logger.info('your are connected'));
  return connected;
};

export default connect2db;
