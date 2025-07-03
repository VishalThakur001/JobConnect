import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function AuthLayout({ authentication = true, children }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.user); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authentication && !isAuthenticated) {
      navigate("/login");
    } else if (!authentication && isAuthenticated) {
      navigate("/dashboard");
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, authentication, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-blue-600" />
      </div>
    );
  }

  return children;
}