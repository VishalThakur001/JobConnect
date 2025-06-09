import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { clearUserInfo } from "../features/userSlice";
import { Button } from "./ui/button";

function Navbar() {
  const user = useSelector((state) => state.user.userInfo);
  const isAuthenticated = useSelector((state) => state.user.status);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(clearUserInfo());
    navigate("/");
  };

  const getRoleBasedHome = () => {
    if (user?.role === "worker") return "/worker-home";
    if (user?.role === "customer") return "/customer-home";
    return "/home";
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to={isAuthenticated ? getRoleBasedHome() : "/"}
            className="text-2xl font-bold text-blue-600"
          >
            WorkConnect
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/about-us"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  About
                </Link>
                <Link
                  to="/how-it-works"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  How It Works
                </Link>
                <Link
                  to="/services"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Services
                </Link>
                <Link
                  to="/contact"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Contact
                </Link>
              </>
            ) : (
              <>
                <Link
                  to={getRoleBasedHome()}
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Dashboard
                </Link>
                {user?.role === "customer" && (
                  <Link
                    to="/find-workers"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Find Workers
                  </Link>
                )}
                {user?.role === "worker" && (
                  <Link
                    to="/find-jobs"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Find Jobs
                  </Link>
                )}
              </>
            )}
          </div>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <Link to="/login">
                  <Button variant="outline" className="hidden sm:inline-flex">
                    Login
                  </Button>
                </Link>
                <Link to="/register-option">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Get Started
                  </Button>
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                {/* User Info */}
                <div className="hidden sm:block text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {user?.fullName}
                  </div>
                  <div className="text-xs text-gray-500 capitalize">
                    {user?.role} {user?.profession && `• ${user.profession}`}
                  </div>
                </div>

                {/* User Avatar */}
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  {user?.photo ? (
                    <img
                      src={user.photo}
                      alt={user.fullName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-blue-600 font-medium text-sm">
                      {user?.fullName?.charAt(0)?.toUpperCase()}
                    </span>
                  )}
                </div>

                {/* Logout Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="text-red-600 border-red-600 hover:bg-red-50"
                >
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu - You can expand this later */}
      <div className="md:hidden border-t">
        {/* Mobile navigation can be added here */}
      </div>
    </nav>
  );
}

export default Navbar;
