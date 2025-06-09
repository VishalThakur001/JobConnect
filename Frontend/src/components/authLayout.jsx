import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function AuthLayout({ children, authentication = true }) {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.user.status);
  const userInfo = useSelector((state) => state.user.userInfo);

  useEffect(() => {
    if (authentication && !authStatus) {
      navigate("/login");
    } else if (!authentication && authStatus) {
      // Redirect based on user role
      if (userInfo?.role === "worker") {
        navigate("/worker-home");
      } else if (userInfo?.role === "customer") {
        navigate("/customer-home");
      } else {
        navigate("/home"); // fallback
      }
    }
    setLoading(false);
  }, [authStatus, userInfo, navigate, authentication]);

  return loading ? <h1>Loading...</h1> : <>{children}</>;
}

export default AuthLayout;
