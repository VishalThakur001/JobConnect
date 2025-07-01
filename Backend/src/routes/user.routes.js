import express from "express";
import {
  getCurrentUser,
  changePassword,
  updateAccountDetails,
  updateUserLocation,
  updateProfilePhoto,
  getWorkerProfile,
  findNearbyWorkers
} from "../controllers/user.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.get("/me", authenticateUser, getCurrentUser);
router.put("/me/change-password", authenticateUser, changePassword);
router.put("/me/update", authenticateUser, updateAccountDetails);
router.put("/me/update-location", authenticateUser, updateUserLocation);
router.put("/me/update-profile-photo", authenticateUser, upload.single("photo"), updateProfilePhoto);
router.get("/worker/:workerId", getWorkerProfile);
router.get("/nearby-workers", authenticateUser, findNearbyWorkers);

export default router;