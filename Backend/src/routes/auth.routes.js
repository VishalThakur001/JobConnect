import express from "express";
import {
  checkAvailability,
  sendOtpToPhone,
  verifyOtp,
  loginUser,
  registerUser,
  logoutUser,
  refreshAccessToken,
} from "../controllers/auth.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.post("/check-availability", checkAvailability);
router.post("/send-otp", sendOtpToPhone);
router.post("/verify-otp", verifyOtp);
router.post("/register", upload.single("photo"), registerUser);
router.post("/login", loginUser);
router.post("/logout", authenticateUser, logoutUser);
router.post("/refresh-token", refreshAccessToken);

export default router;
