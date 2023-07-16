import express from 'express';
import {
  loginUser,
  registerUser,
  logoutUser,
  googleLoginUser,
  getUserProfile,
  updateUserProfile,
  refreshToken,
  saveUserProfile,
  resetPassword,
} from './controllers/userController.js';
import { authprotect } from './middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/reset-password', resetPassword);
router.post('/login', loginUser);
router.post('/googleLogin', googleLoginUser);
router.post('/logout', logoutUser);
router.post('/refreshToken', refreshToken);
router.post('/saveuserprofile',  saveUserProfile);

router
  .route('/profile')
  .get(authprotect, getUserProfile)
  .put(authprotect, updateUserProfile);

export default router;
