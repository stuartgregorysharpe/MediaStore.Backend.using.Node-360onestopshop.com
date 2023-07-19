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

import {
  addMegaList,
  getMegaList, 
  deleteMegaFile,
  editMegaFile,
} from "./controllers/cloudStorageController.js"

import { authprotect } from './middleware/authMiddleware.js';



const router = express.Router();
// authentication routers
router.post('/register', registerUser);
router.post('/reset-password', resetPassword);
router.post('/login', loginUser);
router.post('/googleLogin', googleLoginUser);
router.post('/logout', logoutUser);
router.post('/refreshToken', refreshToken);
router.post('/saveuserprofile',  saveUserProfile);
// mega.nz storage management routers
router.post('/add-mega-list', addMegaList);
router.post('/get-mega-list', getMegaList);
router.post('/delete-mega-file', deleteMegaFile);
router.post('/edit-mega-file', editMegaFile);

router
  .route('/profile')
  .get(authprotect, getUserProfile)
  .put(authprotect, updateUserProfile);

export default router;
