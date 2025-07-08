import express from "express";
import {
  submitReview,
  updateReview,
  deleteReview,
  getMyReviews,
  getWorkerReviews,
  getReviewsForWorker,
} from "../controllers/review.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/:bookingId/review", authenticateUser, submitReview);
router.put("/update-review/:reviewId", authenticateUser, updateReview);
router.delete("/:reviewId", authenticateUser, deleteReview);
router.get("/my-reviews", authenticateUser, getMyReviews);
router.get("/worker-reviews", authenticateUser, getWorkerReviews);
router.get("/worker/:workerId/reviews", getReviewsForWorker);

export default router;