import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function AuthLayout({ authentication = true, children }) {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.user);
  const isAuthenticated = !!userInfo?.accessToken;

  useEffect(() => {
    if (authentication && !isAuthenticated) {
      // If auth is required but user is not authenticated, redirect to login
      navigate("/login");
    } else if (!authentication && isAuthenticated) {
      // If user is authenticated but trying to access public routes, redirect to dashboard
      navigate("/dashboard");
    }
  }, [isAuthenticated, authentication, navigate]);

  // Don't render children until navigation logic is complete
  if (authentication && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!authentication && isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return children;
}