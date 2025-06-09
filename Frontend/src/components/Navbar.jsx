import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { clearUserInfo } from "../features/userSlice";
import { Button } from "./ui/button";

function Navbar() {
  const user = useSelector((state) => state.user.userInfo);
  const isAuthenticated = useSelector((state) => state.user.status);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(clearUserInfo());
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  const getRoleBasedHome = () => {
    if (user?.role === "worker") return "/worker-home";
    if (user?.role === "customer") return "/customer-home";
    return "/home";
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
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

          {/* Desktop Navigation Links */}
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

          {/* Desktop User Section */}
          <div className="hidden md:flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <Link to="/login">
                  <Button variant="outline">Login</Button>
                </Link>
                <Link to="/register-option">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Get Started
                  </Button>
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {user?.fullName}
                  </div>
                  <div className="text-xs text-gray-500 capitalize">
                    {user?.role} {user?.profession && `• ${user.profession}`}
                  </div>
                </div>

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

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            {isAuthenticated && (
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
            )}
            <button
              onClick={toggleMobileMenu}
              className="text-gray-600 hover:text-blue-600 focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="px-4 py-2 space-y-2">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/about-us"
                  className="block py-2 text-gray-600 hover:text-blue-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  to="/how-it-works"
                  className="block py-2 text-gray-600 hover:text-blue-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  How It Works
                </Link>
                <Link
                  to="/services"
                  className="block py-2 text-gray-600 hover:text-blue-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Services
                </Link>
                <Link
                  to="/contact"
                  className="block py-2 text-gray-600 hover:text-blue-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </Link>
                <div className="pt-2 border-t">
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full mb-2">
                      Login
                    </Button>
                  </Link>
                  <Link
                    to="/register-option"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      Get Started
                    </Button>
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div className="py-2 border-b">
                  <div className="text-sm font-medium text-gray-900">
                    {user?.fullName}
                  </div>
                  <div className="text-xs text-gray-500 capitalize">
                    {user?.role} {user?.profession && `• ${user.profession}`}
                  </div>
                </div>

                <Link
                  to={getRoleBasedHome()}
                  className="block py-2 text-gray-600 hover:text-blue-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>

                {user?.role === "customer" && (
                  <Link
                    to="/find-workers"
                    className="block py-2 text-gray-600 hover:text-blue-600"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Find Workers
                  </Link>
                )}

                {user?.role === "worker" && (
                  <Link
                    to="/find-jobs"
                    className="block py-2 text-gray-600 hover:text-blue-600"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Find Jobs
                  </Link>
                )}

                <div className="pt-2 border-t">
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="w-full text-red-600 border-red-600 hover:bg-red-50"
                  >
                    Logout
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
