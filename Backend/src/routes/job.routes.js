import express from "express";
import {
  createJobPost,
  getMyJobPosts,
  deleteJobPost,
  updateJobPost,
  getJobById,
  getNearbyJobs,
  repostJob,
} from "../controllers/job.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create", authenticateUser, createJobPost);
router.get("/my-posts", authenticateUser, getMyJobPosts);
router.get("/:jobId", authenticateUser, getJobById);
router.put("/update/:jobId", authenticateUser, updateJobPost);
router.delete("/delete/:jobId", authenticateUser, deleteJobPost);

// Worker: repost job
router.post("/:jobId/repost", authenticateUser, repostJob);

// Worker: fetch nearby jobs
router.get("/nearby/all", authenticateUser, getNearbyJobs);

export default router;
