// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  ENDPOINTS: {
    // User endpoints
    USER: {
      CHECK_AVAILABILITY: "/users/check-availability",
      SEND_OTP: "/users/send-otp",
      VERIFY_OTP: "/users/verify-otp",
      REGISTER: "/users/register",
      LOGIN: "/users/login",
      LOGOUT: "/users/logout",
      REFRESH_TOKEN: "/users/refresh-token",
      CURRENT_USER: "/users/me",
      UPDATE_ACCOUNT: "/users/update-account",
      UPDATE_PHOTO: "/users/update-photo",
      CHANGE_PASSWORD: "/users/change-password",
      WORKER_PROFILE: (workerId) => `/users/worker/${workerId}`,
    },

    // Job endpoints
    JOBS: {
      CREATE: "/jobs/create",
      NEARBY: "/jobs/nearby",
      MY_POSTS: "/jobs/my-posts",
      BY_ID: (jobId) => `/jobs/${jobId}`,
      DELETE: (jobId) => `/jobs/${jobId}`,
      APPLY: (jobId) => `/jobs/${jobId}/apply`,
      UPDATE_APPLICATION: (jobId, applicationId) =>
        `/jobs/${jobId}/applications/${applicationId}`,
    },

    // Booking endpoints
    BOOKINGS: {
      CREATE_REQUEST: "/bookings/request",
      NEARBY_WORKERS: "/bookings/workers-nearby",
      WORKER_CURRENT: "/bookings/worker-current",
      CUSTOMER_CURRENT: "/bookings/customer-current",
      BY_ID: (bookingId) => `/bookings/${bookingId}`,
      UPDATE_STATUS: (bookingId) => `/bookings/${bookingId}/status`,
    },
  },

  // Request timeout in milliseconds
  TIMEOUT: 10000,

  // Default headers
  DEFAULT_HEADERS: {
    "Content-Type": "application/json",
  },

  // Status codes
  STATUS_CODES: {
    SUCCESS: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
  },
};

// Helper function to build API URLs
export const buildApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to handle API responses
export const handleApiResponse = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response.data;
  }
  throw new Error(`API Error: ${response.status} ${response.statusText}`);
};

// Helper function to handle API errors
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    return {
      success: false,
      message: error.response.data?.message || "An error occurred",
      status: error.response.status,
      data: error.response.data,
    };
  } else if (error.request) {
    // Request was made but no response received
    return {
      success: false,
      message: "Network error. Please check your connection.",
      status: 0,
    };
  } else {
    // Something else happened
    return {
      success: false,
      message: error.message || "An unexpected error occurred",
      status: 0,
    };
  }
};

export default API_CONFIG;
