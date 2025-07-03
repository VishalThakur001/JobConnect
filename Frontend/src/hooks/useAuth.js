import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { authServices } from "../services/authService";
import { setCredentials, logout as logoutAction } from "../features/userSlice";

// Check phone number availability
export const useCheckAvailability = () => {
  return useMutation({
    mutationFn: (phoneNumber) => authServices.checkAvailability(phoneNumber),
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message || "Phone number is available");
      }
    },
    onError: (error) => {
      toast.error(error.message || "Phone number is already in use");
    },
  });
};

// Send OTP
export const useSendOtp = () => {
  return useMutation({
    mutationFn: (phoneNumber) => authServices.sendOtp(phoneNumber),
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message || "OTP sent successfully");
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to send OTP");
    },
  });
};

// Verify OTP
export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: ({ phoneNumber, otp }) =>
      authServices.verifyOtp(phoneNumber, otp),
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message || "OTP verified successfully");
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to verify OTP");
    },
  });
};

// Register user
export const useRegister = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ userData, photo }) => authServices.register(userData, photo),
    onSuccess: (data) => {
      if (data.success) {
        toast.success(
          data.message || "Registration successful! Welcome to ServiceHub!",
        );

        // Set user credentials in Redux store
        if (data.data?.user && data.data?.accessToken) {
          dispatch(
            setCredentials({
              user: data.data.user,
              accessToken: data.data.accessToken,
            }),
          );

          // Navigate based on user role
          const role = data.data.user?.role;
          if (role === "worker") {
            navigate("/worker/dashboard");
          } else if (role === "customer") {
            navigate("/services");
          } else {
            navigate("/");
          }
        }
      }
    },
    onError: (error) => {
      toast.error(error.message || "Registration failed");
    },
  });
};

// Login user
export const useLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ phoneNumber, password }) =>
      authServices.login(phoneNumber, password),
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message || "Login successful");

        // Set user credentials in Redux store
        if (data.data?.user && data.data?.accessToken) {
          dispatch(
            setCredentials({
              user: data.data.user,
              accessToken: data.data.accessToken,
            }),
          );

          // Navigate based on user role
          const role = data.data.user?.role;
          if (role === "worker") {
            navigate("/worker/dashboard");
          } else if (role === "customer") {
            navigate("/customer/dashboard");
          } else {
            navigate("/");
          }
        }
      }
    },
    onError: (error) => {
      toast.error(error.message || "Login failed");
    },
  });
};

// Logout user
export const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => authServices.logout(),
    onSuccess: (data) => {
      dispatch(logoutAction());
      toast.success(data.message || "Logged out successfully");
      navigate("/");
    },
    onError: (error) => {
      // Still logout locally even if server request fails
      dispatch(logoutAction());
      navigate("/");
      toast.error(error.message || "Logout failed");
    },
  });
};
