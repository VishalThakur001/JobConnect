// src/services/reviewService.js

import axiosInstance from "@/utils/axiosInterceptor";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/reviews`;

const reviewService = {
  // Submit a new review for a completed booking
  submitReview: async (bookingId, reviewData) => {
    try {
      const response = await axiosInstance.post(`${BASE_URL}/${bookingId}/review`, reviewData);
      return {
        success: true,
        data: response.data.review,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to submit review",
        error: error.response?.data,
      };
    }
  },

  // Update an existing review
  updateReview: async (reviewId, updatedData) => {
    try {
      const response = await axiosInstance.put(`${BASE_URL}/update-review/${reviewId}`, updatedData);
      return {
        success: true,
        data: response.data.review,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update review",
        error: error.response?.data,
      };
    }
  },

  // Delete a review
  deleteReview: async (reviewId) => {
    try {
      const response = await axiosInstance.delete(`${BASE_URL}/${reviewId}`);
      return {
        success: true,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to delete review",
        error: error.response?.data,
      };
    }
  },

  // Get all reviews by the current customer
  getMyReviews: async () => {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/my-reviews`);
      return {
        success: true,
        data: response.data.reviews || [],
        message: response.data.message || "Fetched successfully",
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch reviews",
        error: error.response?.data,
      };
    }
  },
};

export default reviewService;
