import axiosInstance from "../utils/axiosInterceptor";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/bookings`;

export const bookingService = {
  // ✅ Create a booking from job application
  createBooking: async (jobId, applicationId) => {
    try {
      const response = await axiosInstance.post(
        `${BASE_URL}/create-booking/${jobId}/${applicationId}`
      );
      return {
        success: true,
        data: response.data.booking,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to create booking request",
        error: error.response?.data,
      };
    }
  },

  // ✅ Get bookings for worker
  getWorkerBookings: async (status = "") => {
    try {
      const query = status ? `?status=${status}` : "";
      const response = await axiosInstance.get(
        `${BASE_URL}/worker-bookings${query}`
      );
      return {
        success: true,
        data: response.data.bookings || [],
        stats: response.data.stats,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to fetch worker bookings",
        error: error.response?.data,
      };
    }
  },

  // ✅ Get bookings for customer
  getCustomerBookings: async (status = "") => {
    try {
      const query = status ? `?status=${status}` : "";
      const response = await axiosInstance.get(
        `${BASE_URL}/customer-bookings${query}`
      );
      return {
        success: true,
        data: response.data.bookings || [],
        stats: response.data.stats,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to fetch customer bookings",
        error: error.response?.data,
      };
    }
  },

  // ✅ Get booking by ID
  getBookingById: async (bookingId) => {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/${bookingId}`);
      return {
        success: true,
        data: response.data.booking,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to fetch booking details",
        error: error.response?.data,
      };
    }
  },

  // ✅ Update booking status
  updateBookingStatus: async (bookingId, status) => {
    try {
      const response = await axiosInstance.patch(
        `${BASE_URL}/${bookingId}/status`,
        { status }
      );
      return {
        success: true,
        data: response.data.booking,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to update booking status",
        error: error.response?.data,
      };
    }
  },

  // ✅ Worker actions
  acceptBooking: async (bookingId) => {
    return bookingService.updateBookingStatus(bookingId, "accepted");
  },

  rejectBooking: async (bookingId) => {
    return bookingService.updateBookingStatus(bookingId, "rejected");
  },

  startWork: async (bookingId) => {
    return bookingService.updateBookingStatus(bookingId, "in-progress");
  },

  completeWork: async (bookingId) => {
    return bookingService.updateBookingStatus(bookingId, "completed");
  },

  // ✅ Common action
  cancelBooking: async (bookingId) => {
    return bookingService.updateBookingStatus(bookingId, "cancelled");
  },

  // ✅ Confirm completion (by customer)
  confirmCompletion: async (bookingId, rating = null, review = "") => {
    try {
      const response = await axiosInstance.patch(
        `${BASE_URL}/${bookingId}/status`,
        {
          status: "confirmed",
          rating,
          review,
        }
      );
      return {
        success: true,
        data: response.data.booking,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Failed to confirm booking completion",
        error: error.response?.data,
      };
    }
  },
};

export default bookingService;