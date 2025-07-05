import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Menu,
  X,
  User,
  LogOut,
  Settings,
  Briefcase,
  Search,
  Heart,
  MessageCircle,
} from "lucide-react";
import { Button } from "./ui/button";
import { logout } from "../features/userSlice";
import { cn } from "../utils/cn";
import UserAvatar from "./UserAvatar";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, role } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/logout");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Navigation items based on authentication and role
  const getNavigationItems = () => {
    const baseItems = [
      { name: "Home", href: "/" },
      { name: "About", href: "/about" },
      { name: "How it Works", href: "/how-it-works" },
    ];

    if (isAuthenticated) {
      if (role === "customer") {
        return [
          { name: "Dashboard", href: "/customer/home" },
          { name: "Post Job", href: "/customer/post-job" },
          { name: "My Jobs", href: "/customer/jobs" },
          ...baseItems.slice(1), // Keep About and How it Works
        ];
      } else if (role === "worker") {
        return [
          { name: "Dashboard", href: "/worker/home" },
          { name: "Find Jobs", href: "/worker/find-jobs" },
          ...baseItems.slice(1), // Keep About and How it Works
        ];
      }
    }

    return baseItems;
  };

  const navigationItems = getNavigationItems();

  return (
    <nav className="border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-background/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 jobconnect-gradient rounded-xl flex items-center justify-center shadow-lg transform transition-transform hover:scale-105">
              <span className="text-white font-bold text-lg">JC</span>
            </div>
            <div>
              <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                JobConnect
              </span>
              <div className="h-0.5 w-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"></div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <UserAvatar
                  user={{ ...user, role }}
                  size="sm"
                  showName={true}
                  showRole={true}
                  className="hidden lg:flex"
                />
                <UserAvatar
                  user={{ ...user, role }}
                  size="sm"
                  className="lg:hidden"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden lg:inline ml-1">Logout</span>
                </Button>
              </div>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Sign Up</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={cn(
          "md:hidden transition-all duration-300 ease-in-out overflow-hidden",
          isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="px-4 pt-2 pb-3 space-y-1 border-t border-border bg-background">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}

          {/* Mobile Auth Section */}
          <div className="pt-4 border-t border-border">
            {isAuthenticated ? (
              <>
                <div className="px-3 py-2">
                  <UserAvatar
                    user={{ ...user, role }}
                    size="md"
                    showName={true}
                    showRole={true}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="w-full justify-start text-muted-foreground hover:text-foreground mt-2"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  asChild
                  className="w-full justify-start"
                >
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    Login
                  </Link>
                </Button>
                <Button asChild className="w-full">
                  <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                    Sign Up
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}