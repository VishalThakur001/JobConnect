import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { userServices } from "../services/userServices";
import { updateUser } from "../features/userSlice";

// Get current user profile
export const useGetProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: userServices.getUser,
    select: (data) => data.data?.user,
  });
};

// Get worker details by ID
export const useGetWorkerById = (workerId) => {
  return useQuery({
    queryKey: ["worker", workerId],
    queryFn: () => userServices.getWorkerById(workerId),
    select: (data) => data.data,
    enabled: !!workerId,
  });
};

// Update profile (matches backend updateAccountDetails exactly)
export const useUpdateProfile = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profileData) => {
      // Format data exactly as backend expects
      const formattedData = {
        ...(profileData.fullName && { fullName: profileData.fullName }),
        ...(profileData.email && { email: profileData.email }),
        ...(profileData.address && {
          address: {
            street: profileData.address.street,
            city: profileData.address.city,
            state: profileData.address.state,
            pincode: profileData.address.pincode,
          },
        }),
        ...(profileData.profession && { profession: profileData.profession }),
        ...(profileData.availabilityTimes && {
          availabilityTimes: profileData.availabilityTimes,
        }),
        ...(profileData.experienceYears && {
          experienceYears: profileData.experienceYears,
        }),
        ...(profileData.bookingsAday && {
          bookingsAday: profileData.bookingsAday,
        }),
      };

      return userServices.updateUser(formattedData);
    },
    onSuccess: (data) => {
      if (data.success && data.data?.user) {
        dispatch(updateUser(data.data.user));
        queryClient.invalidateQueries({ queryKey: ["profile"] });
        toast.success(data.message || "Profile updated successfully");
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update profile");
    },
  });
};

export const useUpdateStatus = () => {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: (isAvailable) => userServices.updateStatus(isAvailable),
    onSuccess: (data) => {
      if (data.success) {
        dispatch(updateUser(data.data.user));
        toast.success(data.message || "Status updated successfully");
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update status");
    },
  });
};

// Change password
export const useChangePassword = () => {
  return useMutation({
    mutationFn: (passwordData) => userServices.changePassword(passwordData),
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message || "Password changed successfully");
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to change password");
    },
  });
};

// Update profile photo
export const useUpdateProfilePhoto = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (photoFormData) =>
      userServices.changeProfilePhoto(photoFormData),
    onSuccess: (data) => {
      if (data.success && data.data?.user) {
        dispatch(updateUser(data.data.user));
        queryClient.invalidateQueries({ queryKey: ["profile"] });
        toast.success(data.message || "Profile photo updated successfully");
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update profile photo");
    },
  });
};

// Update location
export const useUpdateLocation = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (locationData) => userServices.updateLocation(locationData),
    onSuccess: (data) => {
      if (data.success && data.data?.user) {
        dispatch(updateUser(data.data.user));
        queryClient.invalidateQueries({ queryKey: ["profile"] });
        toast.success(data.message || "Location updated successfully");
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update location");
    },
  });
};