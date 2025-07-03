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

  // Simple navigation items for all users
  const navigationItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "How it Works", href: "/how-it-works" },
  ];

  return (
    <nav className="border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-background/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">
                JC
              </span>
            </div>
            <span className="font-bold text-xl text-foreground">
              JobConnect
            </span>
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
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                    <span className="text-secondary-foreground text-sm font-medium">
                      {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  </div>
                  <div className="hidden lg:block">
                    <p className="text-sm font-medium text-foreground">
                      {user?.name}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {role}
                    </p>
                  </div>
                </div>
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
                <div className="flex items-center space-x-2 px-3 py-2">
                  <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                    <span className="text-secondary-foreground text-sm font-medium">
                      {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {user?.name}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {role}
                    </p>
                  </div>
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
