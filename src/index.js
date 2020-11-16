/* eslint-disable import/no-cycle */
/* eslint-disable no-param-reassign */
import 'dotenv/config';
import socketIo from 'socket.io';
import app, { logger } from './config';
import connect2db from './db/setUp';
import socketManager from './socketManager/socket';

const port = 5000 || process.env.PORT;
connect2db();

const server = app.listen(port, () => {
  logger.info('application listening on port 5000');
});

const io = socketIo(server);

io.on('connection', (socket) => {
  socketManager(socket);
});

export default {
  app,
  io,
};
