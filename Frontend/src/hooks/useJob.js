import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import jobService from '@/services/jobService';

// Unique keys for each feature
const JOB_KEYS = {
  allNearby: 'nearbyJobs',
  myJobs: 'myJobPosts',
  jobById: (id) => ['job', id],
};

// Fetch nearby jobs
export const useNearbyJobs = (filters = {}) =>
  useQuery({
    queryKey: [JOB_KEYS.allNearby, filters],
    queryFn: () => jobService.getNearbyJobs(filters),
    select: (res) => res.data,
  });

// Fetch my job posts (customer)
export const useMyJobPosts = (page = 1, limit = 10) =>
  useQuery({
    queryKey: [JOB_KEYS.myJobs, page, limit],
    queryFn: () => jobService.getMyJobPosts(page, limit),
    select: (res) => ({ jobs: res.data, pagination: res.pagination }),
  });

// Fetch job by ID
export const useJobById = (jobId) =>
  useQuery({
    queryKey: JOB_KEYS.jobById(jobId),
    queryFn: () => jobService.getJobById(jobId),
    enabled: !!jobId,
    select: (res) => res.data,
  });

// Create a new job post
export const useCreateJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: jobService.createJob,
    onSuccess: () => {
      queryClient.invalidateQueries([JOB_KEYS.myJobs]);
    },
  });
};

// Update a job post
export const useUpdateJob = (jobId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updates) => jobService.updateJobPost(jobId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries([JOB_KEYS.jobById(jobId)]);
      queryClient.invalidateQueries([JOB_KEYS.myJobs]);
    },
  });
};

// Delete a job post
export const useDeleteJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: jobService.deleteJobPost,
    onSuccess: () => {
      queryClient.invalidateQueries([JOB_KEYS.myJobs]);
    },
  });
};

// Repost a job
export const useRepostJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: jobService.repostJob,
    onSuccess: () => {
      queryClient.invalidateQueries([JOB_KEYS.myJobs]);
    },
  });
};
