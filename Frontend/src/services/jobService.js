import axiosInstance from "../utils/axiosInterceptor";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/jobs`;

export const jobService = {
  // Create a job post
  createJob: async (jobData) => {
    try {
      const response = await axiosInstance.post(`${BASE_URL}/create`, jobData);
      return {
        success: true,
        data: response.data.job,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to create job post",
        error: error.response?.data,
      };
    }
  },

  // Get nearby jobs (for worker)
  getNearbyJobs: async (filters = {}) => {
    try {
      const params = new URLSearchParams();

      if (filters.profession) params.append("profession", filters.profession);
      if (filters.budget?.min) params.append("budget_min", filters.budget.min);
      if (filters.budget?.max) params.append("budget_max", filters.budget.max);
      if (filters.radius) params.append("radius", filters.radius);
      if (filters.page) params.append("page", filters.page);
      if (filters.limit) params.append("limit", filters.limit);
      if (filters.sortBy) params.append("sortBy", filters.sortBy);

      const response = await axiosInstance.get(
        `${BASE_URL}/nearby/all?${params.toString()}`
      );
      return {
        success: true,
        data: response.data.jobs || [],
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch nearby jobs",
        error: error.response?.data,
      };
    }
  },

  // Get authenticated user's job posts (customer)
  getMyJobPosts: async (page = 1, limit = 10) => {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/my-posts`, {
        params: { page, limit },
      });
      return {
        success: true,
        data: response.data.jobs || [],
        pagination: response.data.pagination,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to fetch your job posts",
        error: error.response?.data,
      };
    }
  },

  // Get job by ID
  getJobById: async (jobId) => {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/${jobId}`);
      return {
        success: true,
        data: response.data.job,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch job details",
        error: error.response?.data,
      };
    }
  },

  // Update a job post (only if still open)
  updateJobPost: async (jobId, updates) => {
    try {
      const response = await axiosInstance.put(
        `${BASE_URL}/update/${jobId}`,
        updates,
      );
      return {
        success: true,
        data: response.data.job,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update job post",
        error: error.response?.data,
      };
    }
  },

  // Delete a job post
  deleteJobPost: async (jobId) => {
    try {
      const response = await axiosInstance.delete(
        `${BASE_URL}/delete/${jobId}`,
      );
      return {
        success: true,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to delete job post",
        error: error.response?.data,
      };
    }
  },

  // Repost a job (duplicate and create a new one)
  repostJob: async (jobId) => {
    try {
      const response = await axiosInstance.post(`${BASE_URL}/${jobId}/repost`);
      return {
        success: true,
        data: response.data.job,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to repost job",
        error: error.response?.data,
      };
    }
  },
};

export default jobService;