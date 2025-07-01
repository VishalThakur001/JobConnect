import axiosInstance from "../utils/axiosInterceptor";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/job-applications`;

export const jobApplicationService = {
  // Worker applies to a job
  applyToJob: async (jobId, applicationData) => {
    try {
      const response = await axiosInstance.post(`${BASE_URL}/apply/${jobId}`, applicationData);
      return {
        success: true,
        data: response.data.application,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to apply to job",
        error: error.response?.data,
      };
    }
  },

  // Worker gets all applications submitted
  getMyApplications: async () => {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/my-applications`);
      return {
        success: true,
        data: response.data.applications || [],
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch your applications",
        error: error.response?.data,
      };
    }
  },

  // Customer gets all applications for one of their jobs
  getApplicationsForJob: async (jobId) => {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/job-applications/${jobId}`);
      return {
        success: true,
        data: response.data.applications || [],
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch applications for job",
        error: error.response?.data,
      };
    }
  },

  // Customer updates application status (accept/reject)
  updateApplicationStatus: async (applicationId, status) => {
    try {
      const response = await axiosInstance.put(`${BASE_URL}/${applicationId}`, { status });
      return {
        success: true,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update application status",
        error: error.response?.data,
      };
    }
  },

  // Worker or Customer confirms application (to trigger booking)
  confirmApplication: async (applicationId) => {
    try {
      const response = await axiosInstance.put(`${BASE_URL}/${applicationId}/accept`);
      return {
        success: true,
        data: response.data.application,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to confirm application",
        error: error.response?.data,
      };
    }
  },
};

export default jobApplicationService;