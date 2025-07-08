import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  Search,
  Calendar,
  Star,
  Clock,
  MapPin,
  Plus,
  Heart,
  MessageCircle,
  User,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Settings,
  Briefcase,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { cn } from "../utils/cn";
import UserAvatar from "../components/UserAvatar";
import { useCustomerBookings } from "../hooks/useBooking";

export default function CustomerHomePage() {
  const { user } = useSelector((state) => state.user);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch real booking data
  const {
    data: bookingsData,
    isLoading: bookingsLoading,
    error: bookingsError,
  } = useCustomerBookings();
  const recentBookings = bookingsData || [];
  const bookingStats = bookingsData?.stats || {};

  const popularServices = [
    { name: "Home Cleaning", icon: "🏠", bookings: 145 },
    { name: "Plumbing", icon: "🔧", bookings: 98 },
    { name: "Electrical", icon: "⚡", bookings: 87 },
    { name: "Gardening", icon: "🌱", bookings: 76 },
    { name: "Moving", icon: "📦", bookings: 65 },
    { name: "Pet Care", icon: "🐕", bookings: 54 },
  ];

  // Calculate real stats from booking data
  const totalBookings = recentBookings?.length || 0;
  const completedBookings =
    recentBookings?.filter((booking) => booking.status === "completed")
      ?.length || 0;
  const upcomingBookings =
    recentBookings?.filter(
      (booking) =>
        booking.status === "upcoming" || booking.status === "accepted",
    )?.length || 0;
  const favoriteWorkers = 0; // This would need a separate API call for favorites

  const stats = [
    {
      label: "Total Bookings",
      value: bookingStats.total || totalBookings.toString(),
      icon: Calendar,
      color: "text-blue-600",
    },
    {
      label: "Completed",
      value: bookingStats.completed || completedBookings.toString(),
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      label: "Upcoming",
      value: bookingStats.upcoming || upcomingBookings.toString(),
      icon: Clock,
      color: "text-orange-600",
    },
    {
      label: "In Progress",
      value:
        bookingStats.inProgress ||
        recentBookings
          ?.filter((booking) => booking.status === "in-progress")
          ?.length?.toString() ||
        "0",
      icon: AlertCircle,
      color: "text-purple-600",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-50";
      case "upcoming":
        return "text-blue-600 bg-blue-50";
      case "in-progress":
        return "text-orange-600 bg-orange-50";
      case "cancelled":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return CheckCircle;
      case "upcoming":
        return Clock;
      case "in-progress":
        return AlertCircle;
      default:
        return Calendar;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <UserAvatar user={user} size="3xl" className="hidden sm:flex" />
              <UserAvatar user={user} size="2xl" className="sm:hidden" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Welcome back, {user?.fullName || user?.name}!
                </h1>
                <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                  Find and manage your service bookings
                </p>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-600 font-medium">
                      Active
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Customer Dashboard
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" asChild>
                <Link to="/customer/bookings">
                  <Calendar className="w-4 h-4 mr-2" />
                  My Bookings
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/customer/jobs">
                  <Briefcase className="w-4 h-4 mr-2" />
                  Manage Jobs
                </Link>
              </Button>
              <Button asChild>
                <Link to="/customer/post-job">
                  <Plus className="w-4 h-4 mr-2" />
                  Post Job
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/profile">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Search */}
        <Card className="mb-8 card-gradient border-none shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-t-lg">
            <CardTitle className="flex items-center text-lg">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                <Search className="w-4 h-4 text-white" />
              </div>
              Find Services
            </CardTitle>
            <CardDescription>Search for services in your area</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="What service do you need? (e.g., cleaning, plumbing)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="sm:w-48">
                <Input placeholder="Your location" className="w-full" />
              </div>
              <Button className="sm:w-auto">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const gradients = [
              "bg-gradient-to-br from-blue-400 to-blue-600",
              "bg-gradient-to-br from-green-400 to-green-600",
              "bg-gradient-to-br from-orange-400 to-orange-600",
              "bg-gradient-to-br from-red-400 to-red-600",
            ];
            return (
              <Card
                key={index}
                className="card-gradient border-none shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {stat.label}
                      </p>
                      <p className="text-2xl font-bold text-foreground">
                        {stat.value}
                      </p>
                    </div>
                    <div
                      className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center",
                        gradients[index],
                      )}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Bookings */}
          <div className="lg:col-span-2">
            {/* Today's Bookings */}
            <Card className="mb-6 card-gradient border-none shadow-xl">
              <CardHeader className="bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center text-lg">
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mr-3">
                      <Clock className="w-4 h-4 text-white" />
                    </div>
                    Today's Schedule
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="glass-effect border-orange-200"
                  >
                    <Link to="/customer/bookings">
                      <Calendar className="w-4 h-4 mr-1" />
                      View Calendar
                    </Link>
                  </Button>
                </div>
                <CardDescription>
                  Your scheduled services for today
                </CardDescription>
              </CardHeader>
              <CardContent>
                {bookingsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">
                      Loading your schedule...
                    </p>
                  </div>
                ) : bookingsError ? (
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <p className="text-red-600 mb-4">
                      Failed to load your bookings
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => window.location.reload()}
                    >
                      Try Again
                    </Button>
                  </div>
                ) : recentBookings.filter(
                    (booking) =>
                      booking.status === "upcoming" ||
                      booking.status === "in-progress" ||
                      booking.status === "accepted",
                  ).length > 0 ? (
                  <div className="space-y-4">
                    {recentBookings
                      .filter(
                        (booking) =>
                          booking.status === "upcoming" ||
                          booking.status === "in-progress" ||
                          booking.status === "accepted",
                      )
                      .map((booking) => {
                        const StatusIcon = getStatusIcon(booking.status);
                        return (
                          <div
                            key={booking._id}
                            className="p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                          >
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <h4 className="font-semibold text-foreground">
                                  {booking.job?.title ||
                                    booking.job?.category ||
                                    "Service"}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  Worker:{" "}
                                  {booking.worker?.fullName ||
                                    "Assigned Worker"}
                                </p>
                                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                  <span className="flex items-center">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {booking.scheduledTime
                                      ? new Date(
                                          booking.scheduledTime,
                                        ).toLocaleTimeString([], {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        })
                                      : "TBD"}
                                  </span>
                                  <span className="flex items-center">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    {booking.scheduledDate
                                      ? new Date(
                                          booking.scheduledDate,
                                        ).toLocaleDateString()
                                      : "TBD"}
                                  </span>
                                </div>
                              </div>
                              <div className="text-right space-y-2">
                                <p className="font-semibold text-foreground">
                                  $
                                  {booking.totalAmount ||
                                    booking.job?.budget ||
                                    0}
                                </p>
                                <span
                                  className={cn(
                                    "text-xs px-2 py-1 rounded-full capitalize",
                                    getStatusColor(booking.status),
                                  )}
                                >
                                  {booking.status}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 mt-3">
                              <Button size="sm" variant="outline">
                                <MessageCircle className="w-4 h-4 mr-1" />
                                Message
                              </Button>
                              <Button size="sm" variant="outline">
                                View Details
                              </Button>
                              {booking.status === "upcoming" && (
                                <>
                                  <Button size="sm" variant="outline">
                                    Reschedule
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    Cancel
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      No services scheduled for today
                    </p>
                    <Button className="mt-4" asChild>
                      <Link to="/customer/post-job">Book a Service</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* All Bookings History */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Bookings</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/customer/bookings">
                        <Calendar className="w-4 h-4 mr-1" />
                        Manage All
                      </Link>
                    </Button>
                    <Button size="sm" asChild>
                      <Link to="/customer/post-job">
                        <Plus className="w-4 h-4 mr-1" />
                        Book Service
                      </Link>
                    </Button>
                  </div>
                </div>
                <CardDescription>
                  Your latest service bookings with quick actions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookingsLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                      <p className="text-muted-foreground">
                        Loading bookings...
                      </p>
                    </div>
                  ) : recentBookings.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">
                        No bookings yet
                      </p>
                      <Button asChild>
                        <Link to="/customer/post-job">
                          Book Your First Service
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    recentBookings.map((booking) => {
                      const StatusIcon = getStatusIcon(booking.status);
                      return (
                        <div
                          key={booking._id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex items-center space-x-4">
                            <div
                              className={cn(
                                "p-2 rounded-full",
                                getStatusColor(booking.status),
                              )}
                            >
                              <StatusIcon className="w-4 h-4" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-foreground">
                                {booking.job?.title ||
                                  booking.job?.category ||
                                  "Service"}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                with{" "}
                                {booking.worker?.fullName || "Assigned Worker"}
                              </p>
                              <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                                <span className="flex items-center">
                                  <Calendar className="w-3 h-3 mr-1" />
                                  {booking.scheduledDate
                                    ? new Date(
                                        booking.scheduledDate,
                                      ).toLocaleDateString()
                                    : "TBD"}
                                </span>
                                <span className="flex items-center">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {booking.scheduledTime
                                    ? new Date(
                                        booking.scheduledTime,
                                      ).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })
                                    : "TBD"}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-foreground mb-2">
                              ${booking.totalAmount || booking.job?.budget || 0}
                            </p>
                            {booking.rating && (
                              <div className="flex items-center text-yellow-500 text-sm mb-2">
                                <Star className="w-3 h-3 mr-1 fill-current" />
                                {booking.rating}
                              </div>
                            )}
                            <span
                              className={cn(
                                "text-xs px-2 py-1 rounded-full capitalize block mb-3",
                                getStatusColor(booking.status),
                              )}
                            >
                              {booking.status}
                            </span>
                            <div className="flex flex-col space-y-1">
                              {(booking.status === "upcoming" ||
                                booking.status === "accepted") && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-xs"
                                  asChild
                                >
                                  <Link
                                    to={`/customer/bookings/${booking._id}`}
                                  >
                                    Reschedule
                                  </Link>
                                </Button>
                              )}
                              {(booking.status === "upcoming" ||
                                booking.status === "accepted" ||
                                booking.status === "in-progress") && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-xs text-red-600 hover:text-red-700"
                                  asChild
                                >
                                  <Link
                                    to={`/customer/bookings/${booking._id}`}
                                  >
                                    Cancel
                                  </Link>
                                </Button>
                              )}
                              {booking.status === "completed" &&
                                !booking.rating && (
                                  <Button size="sm" className="text-xs" asChild>
                                    <Link
                                      to={`/customer/bookings/${booking._id}/review`}
                                    >
                                      Rate Service
                                    </Link>
                                  </Button>
                                )}
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs"
                                asChild
                              >
                                <Link to={`/customer/bookings/${booking._id}`}>
                                  View Details
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Popular Services */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Popular Services
                </CardTitle>
                <CardDescription>
                  Most booked services this week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {popularServices.map((service, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{service.icon}</span>
                        <span className="font-medium text-foreground">
                          {service.name}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {service.bookings} bookings
                      </span>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  Browse All Services
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" asChild>
                  <Link to="/customer/bookings">
                    <Calendar className="w-4 h-4 mr-2" />
                    View & Manage Bookings
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <Link to="/customer/post-job">
                    <Plus className="w-4 h-4 mr-2" />
                    Post New Job
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <Link to="/customer/jobs">
                    <Briefcase className="w-4 h-4 mr-2" />
                    Manage Job Posts
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Message Workers
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Star className="w-4 h-4 mr-2" />
                  Leave Reviews
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Heart className="w-4 h-4 mr-2" />
                  View Favorites
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <Link to="/profile">
                    <User className="w-4 h-4 mr-2" />
                    Update Profile
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Emergency Services */}
            <Card className="border-red-200 bg-red-50/50">
              <CardHeader>
                <CardTitle className="text-red-700">
                  Emergency Services
                </CardTitle>
                <CardDescription className="text-red-600">
                  Need urgent help? Find available workers now
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-red-600 hover:bg-red-700">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Find Emergency Help
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}