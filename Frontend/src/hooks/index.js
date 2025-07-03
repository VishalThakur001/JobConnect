// Authentication hooks
export {
  useCheckAvailability,
  useSendOtp,
  useVerifyOtp,
  useRegister,
  useLogin,
  useLogout,
} from "./useAuth";

// User hooks
export {
  userKeys,
  useCurrentUser,
  useWorker,
  useNearbyWorkers,
  useUpdateUser,
  useChangePassword,
  useUpdateLocation,
  useChangeProfilePhoto,
} from "./useUser";

// Profile hooks
export {
  useGetProfile,
  useUpdateProfile,
  useChangePassword as useProfileChangePassword,
  useUpdateProfilePhoto as useProfileUpdatePhoto,
  useUpdateLocation as useProfileUpdateLocation,
} from "./useProfile";

// Job hooks
export {
  jobKeys,
  useNearbyJobs,
  useMyJobPosts,
  useJobDetail,
  useCreateJob,
  useUpdateJobPost,
  useDeleteJobPost,
  useRepostJob,
} from "./useJob";

// Booking hooks
export {
  bookingKeys,
  useWorkerBookings,
  useCustomerBookings,
  useBookingDetail,
  useCreateBooking,
  useUpdateBookingStatus,
  useAcceptBooking,
  useRejectBooking,
  useStartWork,
  useCompleteWork,
  useCancelBooking,
  useConfirmCompletion,
} from "./useBooking";

// Application hooks
export {
  applicationKeys,
  useMyApplications,
  useApplicationsForJob,
  useApplyToJob,
  useUpdateApplicationStatus,
  useConfirmApplication,
} from "./useApplication";

// Review hooks
export {
  reviewKeys,
  useMyReviews,
  useSubmitReview,
  useUpdateReview,
  useDeleteReview,
} from "./useReview";

// Review notifications
export { useReviewNotifications } from "./useReviewNotifications.jsx";
