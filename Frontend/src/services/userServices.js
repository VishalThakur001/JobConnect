import axiosInstance from "../utils/axiosInterceptor";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/users`;

export const userServices = {
  getUser: async () => {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/me`);
      return {
        success: true,
        data: response.data,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to get user",
        error: error.response?.data,
      };
    }
  },

  updateUser: async (userData) => {
    try {
      const response = await axiosInstance.put(
        `${BASE_URL}/me/update`,
        userData,
      );
      return {
        success: true,
        data: response.data,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update user",
        error: error.response?.data,
      };
    }
  },

  changePassword: async (passwordData) => {
    try {
      const response = await axiosInstance.put(
        `${BASE_URL}/me/change-password`,
        passwordData,
      );
      return {
        success: true,
        data: response.data,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update password",
        error: error.response?.data,
      };
    }
  },

  updateLocation: async (locationData) => {
    try {
      const response = await axiosInstance.put(
        `${BASE_URL}/me/update-location`,
        locationData,
      );
      return {
        success: true,
        data: response.data,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update location",
        error: error.response?.data,
      };
    }
  },

  changeProfilePhoto: async (photo) => {
    try {
      const response = await axiosInstance.put(
        `${BASE_URL}/me/update-profile-photo`,
        photo,
        { headers: { "Content-Type": "multipart/form-data" } },
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
          error.response?.data?.message || "Failed to update profile photo",
        error: error.response?.data,
      };
    }
  },

  worker: async (workerId) => {
    try {
      const response = await axiosInstance.get(
        `${BASE_URL}/worker/${workerId}`,
      );
      return {
        success: true,
        data: response.data,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to get worker",
        error: error.response?.data,
      };
    }
  },

  findWorkers: async () => {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/nearby-workers`);
      return {
        success: true,
        data: response.data,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to find workers",
        error: error.response?.data,
      };
    }
  },
};