/* eslint-disable import/no-cycle */
import express from 'express';
import bodyParser from 'body-parser';
import status from 'http-status';
import cors from 'cors';
import route from './route';

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => res.status(status.OK).send({
  message: 'WElCOME TO OUR CHAT APP',
}));

app.get('/message', (req, res) => {
  res.send('hsd');
});

app.use('/v1/', route);

export default app;
