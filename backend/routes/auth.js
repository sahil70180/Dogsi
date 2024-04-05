import express from "express";
import {
  allUsers,
  deleteUser,
  forgotPassword,
  getUseProfile,
  getUserDetails,
  login,
  logout,
  registerUser,
  resetPassword,
  updatePassword,
  updateUser,
  updateUserProfile,
  uploadAvatar,
} from "../controllers/authController.js";
import { authorizeRoles, isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);

router.route("/me").get(isAuthenticated, getUseProfile);
router.route("/me/update").put(isAuthenticated, updateUserProfile);
router.route("/password/update").put(isAuthenticated, updatePassword);

router.route("/me/upload_avatar").put(isAuthenticated, uploadAvatar);

router
  .route("/admin/users")
  .get(isAuthenticated, authorizeRoles("admin"), allUsers);
router
  .route("/admin/users/:id")
  .get(isAuthenticated, authorizeRoles("admin"), getUserDetails)
  .put(isAuthenticated, authorizeRoles("admin"), updateUser)
  .delete(isAuthenticated, authorizeRoles("admin"), deleteUser);


export default router;
