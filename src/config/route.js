/* eslint-disable import/no-cycle */
import { Router } from 'express';
import user from '../controller/user';
import auth from '../middleware/auth';
import userMiddleware from '../middleware/user';

const router = new Router();

router.post('/signup', user.signup);
router.post('/login', user.login);
router.get('/getUser', auth.verifyUser, user.getUser);
router.get('/getAllUser', auth.verifyUser, user.fetchAllUser);
router.post('/addAsFriend', auth.verifyUser, userMiddleware.friendship, user.addAsFriend);
router.get('/friends', auth.verifyUser, user.fetchFriends);
router.get('/rooms', user.fetchAllRooms);
router.get('/message/:senderId/:receiverId', user.fetchMessage);
router.delete('/removeFriend/:_id', auth.verifyUser, user.removeFriend);
export default router;
