import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import reviewService from "@/services/reviewService";
import toast from "react-hot-toast";

// QUERY KEYS
const keys = {
  myReviews: ["myReviews"],
};

// ✅ GET: All reviews by current customer
export const useMyReviews = () =>
  useQuery({
    queryKey: keys.myReviews,
    queryFn: () => reviewService.getMyReviews(),
    select: (res) => res.data,
  });

// ✅ POST: Submit a review for a booking
export const useSubmitReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookingId, reviewData }) =>
      reviewService.submitReview(bookingId, reviewData),
    onSuccess: (res) => {
      toast.success(res.message);
      queryClient.invalidateQueries({ queryKey: keys.myReviews });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
};

// ✅ PUT: Update an existing review
export const useUpdateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId, updatedData }) =>
      reviewService.updateReview(reviewId, updatedData),
    onSuccess: (res) => {
      toast.success(res.message);
      queryClient.invalidateQueries({ queryKey: keys.myReviews });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
};

// ✅ DELETE: Remove a review
export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewId) => reviewService.deleteReview(reviewId),
    onSuccess: (res) => {
      toast.success(res.message);
      queryClient.invalidateQueries({ queryKey: keys.myReviews });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
};
