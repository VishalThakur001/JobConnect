import { Route, Routes } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";

import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import LogoutPage from "./pages/LogoutPage";
import CustomerHomePage from "./pages/CustomerHomePage";
import WorkerHomePage from "./pages/WorkerHomePage";
import CheckPhoneAvailabilityPage from "./pages/Registration/CheckPhoneAvailabilityPage";
import VerifyOTPPage from "./pages/Registration/VerifyOtpPage";
import ChooseRolePage from "./pages/Registration/ChooseRolePage";
import RegisterWorkerPage from "./pages/Registration/RegisterWorkerPage";
import RegisterCustomerPage from "./pages/Registration/RegisterCustomerPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import AboutPage from "./pages/AboutPage";
import ProfilePage from "./pages/ProfilePage";
import AuthLayout from "./components/authLayout";

function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Routes>
        {/* Public Routes (Unauthenticated Only) */}
        <Route
          path="/"
          element={
            <AuthLayout authentication={false}>
              <LandingPage />
            </AuthLayout>
          }
        />
        <Route
          path="/login"
          element={
            <AuthLayout authentication={false}>
              <LoginPage />
            </AuthLayout>
          }
        />
        <Route path="/logout" element={<LogoutPage />} />

        {/* Registration Flow - Only accessible if not logged in */}
        <Route
          path="/register"
          element={
            <AuthLayout authentication={false}>
              <CheckPhoneAvailabilityPage />
            </AuthLayout>
          }
        />
        <Route
          path="/register/check-phone"
          element={
            <AuthLayout authentication={false}>
              <CheckPhoneAvailabilityPage />
            </AuthLayout>
          }
        />
        <Route
          path="/register/verify-otp"
          element={
            <AuthLayout authentication={false}>
              <VerifyOTPPage />
            </AuthLayout>
          }
        />
        <Route
          path="/register/choose-role"
          element={
            <AuthLayout authentication={false}>
              <ChooseRolePage />
            </AuthLayout>
          }
        />
        <Route
          path="/register/worker"
          element={
            <AuthLayout authentication={false}>
              <RegisterWorkerPage />
            </AuthLayout>
          }
        />
        <Route
          path="/register/customer"
          element={
            <AuthLayout authentication={false}>
              <RegisterCustomerPage />
            </AuthLayout>
          }
        />

        {/* Authenticated Routes */}
        <Route
          path="/customer/home"
          element={
            <AuthLayout>
              <CustomerHomePage />
            </AuthLayout>
          }
        />
        <Route
          path="/worker/home"
          element={
            <AuthLayout>
              <WorkerHomePage />
            </AuthLayout>
          }
        />
        <Route
          path="/worker/profile"
          element={
            <AuthLayout>
              <ProfilePage />
            </AuthLayout>
          }
        />
        <Route
          path="/customer/profile"
          element={
            <AuthLayout>
              <ProfilePage />
            </AuthLayout>
          }
        />
        <Route
          path="/dashboard"
          element={
            <AuthLayout>
              {/* Optional: Smart redirect based on role */}
              <DashboardRedirect />
            </AuthLayout>
          }
        />
        <Route
          path="/how-it-works"
          element={
            <AuthLayout authentication={false}>
              <HowItWorksPage />
            </AuthLayout>
          }
        />
        <Route
          path="/about"
          element={
            <AuthLayout authentication={false}>
              <AboutPage />
            </AuthLayout>
          }
        />
      </Routes>
    </div>
  );
}

function DashboardRedirect() {
  const { role } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (role === "customer") {
      navigate("/customer/home");
    } else if (role === "worker") {
      navigate("/worker/home");
    } else {
      navigate("/login");
    }
  }, [role, navigate]);

  return null;
}

export default App;