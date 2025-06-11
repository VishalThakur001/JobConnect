import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userService } from "../services/userService";
import { setUserInfo, clearUserInfo } from "../features/userSlice";

/**
 * Hook to initialize the app and connect with backend
 * This runs on app startup to verify user authentication
 * and sync state with backend
 */
export const useAppInitialization = () => {
  const dispatch = useDispatch();
  const { userInfo, accessToken } = useSelector((state) => state.user);

  useEffect(() => {
    const initializeApp = async () => {
      // Only check if we have an access token but no user info
      // or if we have user info but need to verify it's still valid
      if (accessToken) {
        try {
          const result = await userService.getCurrentUser();

          if (result.success) {
            // Update user info if it's different from what we have
            if (!userInfo || userInfo._id !== result.data._id) {
              dispatch(
                setUserInfo({
                  user: result.data,
                  accessToken: accessToken,
                }),
              );
            }
          } else {
            // Token is invalid, clear user info
            dispatch(clearUserInfo());
          }
        } catch (error) {
          console.error("Failed to verify user authentication:", error);
          // Clear user info on error
          dispatch(clearUserInfo());
        }
      }
    };

    initializeApp();
  }, [dispatch, accessToken, userInfo]);

  return {
    isAuthenticated: !!userInfo && !!accessToken,
    userInfo,
    userRole: userInfo?.role,
  };
};

export default useAppInitialization;
