import axiosInstance from "../utils/axiosInterceptor";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/auth`;

export const authServices = {
  // Check phone number availability
  checkAvailability: async (phoneNumber) => {
    try {
      const response = await axiosInstance.post(
        `${BASE_URL}/check-availability`,
        {
          phoneNumber,
        },
      );
      return {
        success: true,
        data: response.data,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to check availability",
        error: error.response?.data,
      };
    }
  },

  // Send OTP to phone
  sendOtp: async (phoneNumber) => {
    try {
      const response = await axiosInstance.post(`${BASE_URL}/send-otp`, {
        phoneNumber,
      });
      return {
        success: true,
        data: response.data,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to send OTP",
        error: error.response?.data,
      };
    }
  },

  // Verify OTP
  verifyOtp: async (phoneNumber, otp) => {
    try {
      const response = await axiosInstance.post(`${BASE_URL}/verify-otp`, {
        phoneNumber,
        otp,
      });
      return {
        success: true,
        data: response.data,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to verify OTP",
        error: error.response?.data,
      };
    }
  },

  // Register user
  register: async (userData, photo = null) => {
    try {
      const formData = new FormData();

      // Append user data
      Object.keys(userData).forEach((key) => {
        if (typeof userData[key] === "object" && key !== "availabilityTimes") {
          Object.entries(userData[key]).forEach(([subKey, value]) => {
            formData.append(`${key}[${subKey}]`, value);
          });
        } else if (key === "availabilityTimes") {
          formData.append("availabilityTimes", JSON.stringify(userData[key]));
        } else {
          formData.append(key, userData[key]);
        }
      });

      // Append photo if provided
      if (photo) {
        formData.append("photo", photo);
      }

      const response = await axiosInstance.post(
        `${BASE_URL}/register`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      return {
        success: true,
        data: response.data,
        message: response.data.message,
      };
    } catch (error) {
      console.log("Registration error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to register user",
        error: error.response?.data,
      };
    }
  },

  // Login user
  login: async (phoneNumber, password) => {
    try {
      const response = await axiosInstance.post(`${BASE_URL}/login`, {
        phoneNumber,
        password,
      });
      return {
        success: true,
        data: response.data,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to login",
        error: error.response?.data,
      };
    }
  },

  // Logout user
  logout: async () => {
    try {
      const response = await axiosInstance.post(`${BASE_URL}/logout`);
      return {
        success: true,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to logout",
        error: error.response?.data,
      };
    }
  },
};