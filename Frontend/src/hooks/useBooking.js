import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import bookingService from "@/services/bookingService";
import toast from "react-hot-toast";

// QUERY KEYS
const keys = {
  customerBookings: (status) => ["customerBookings", status],
  workerBookings: (status) => ["workerBookings", status],
  bookingById: (id) => ["booking", id],
};

// ✅ GET: Bookings for customer
export const useCustomerBookings = (status = "") =>
  useQuery({
    queryKey: keys.customerBookings(status),
    queryFn: () => bookingService.getCustomerBookings(status),
    select: (res) => res.data,
    enabled: !!status || status === "", // run even if empty
  });

// ✅ GET: Bookings for worker
export const useWorkerBookings = (status = "") =>
  useQuery({
    queryKey: keys.workerBookings(status),
    queryFn: () => bookingService.getWorkerBookings(status),
    select: (res) => res.data,
    enabled: !!status || status === "",
  });

// ✅ GET: Booking by ID
export const useBookingById = (bookingId) =>
  useQuery({
    queryKey: keys.bookingById(bookingId),
    queryFn: () => bookingService.getBookingById(bookingId),
    select: (res) => res.data,
    enabled: !!bookingId,
  });

// ✅ CREATE: Booking (by worker after customer accepts)
export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ jobId, applicationId }) =>
      bookingService.createBooking(jobId, applicationId),
    onSuccess: (res) => {
      toast.success(res.message);
      queryClient.invalidateQueries(); // or refine later
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
};

// ✅ MUTATE: Update status (accept/reject/start/complete/cancel)
export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookingId, status }) =>
      bookingService.updateBookingStatus(bookingId, status),
    onSuccess: (res) => {
      toast.success(res.message);
      queryClient.invalidateQueries();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
};

// ✅ MUTATE: Confirm completion by customer with optional review
export const useConfirmCompletion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookingId, rating, review }) =>
      bookingService.confirmCompletion(bookingId, rating, review),
    onSuccess: (res) => {
      toast.success(res.message);
      queryClient.invalidateQueries();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
};
