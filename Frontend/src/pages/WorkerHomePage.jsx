import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  Calendar,
  Star,
  DollarSign,
  Clock,
  Users,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Settings,
  MessageCircle,
  MapPin,
  Eye,
  Edit,
  ToggleLeft,
  ToggleRight,
  Bell,
  Search,
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { cn } from "../utils/cn";
import { useUpdateStatus } from "../hooks/useProfile";
import { useWorkerBookings } from "../hooks/useBooking";
import UserAvatar from "../components/UserAvatar";

export default function WorkerHomePage() {
  const { user } = useSelector((state) => state.user);
  const updateProfileMutation = useUpdateStatus();

  // Use the actual user's availability status from Redux state
  const isAvailable = user?.isAvailable ?? true;

  const handleAvailabilityToggle = async () => {
    try {
      await updateProfileMutation.mutateAsync({
        isAvailable: !isAvailable,
      });
    } catch (error) {
      console.error("Failed to update availability:", error);
    }
  };

  // Fetch real booking data
  const {
    data: bookingsData,
    isLoading: bookingsLoading,
    error: bookingsError,
  } = useWorkerBookings();
  const allBookings = bookingsData || [];
  const bookingStats = bookingsData?.stats || {};

  // Filter bookings for today's schedule
  const today = new Date().toDateString();
  const todayBookings = allBookings.filter((booking) => {
    if (!booking.scheduledDate) return false;
    const bookingDate = new Date(booking.scheduledDate).toDateString();
    return (
      bookingDate === today &&
      (booking.status === "upcoming" ||
        booking.status === "accepted" ||
        booking.status === "in-progress")
    );
  });

  // Filter upcoming bookings for the next few days
  const upcomingBookings = allBookings.filter((booking) => {
    if (!booking.scheduledDate) return false;
    const bookingDate = new Date(booking.scheduledDate);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return (
      bookingDate > today &&
      (booking.status === "upcoming" || booking.status === "accepted")
    );
  });

  // Get recent reviews from completed bookings
  const recentReviews = allBookings
    .filter((booking) => booking.status === "completed" && booking.rating)
    .slice(0, 2)
    .map((booking) => ({
      id: booking._id,
      customerName: booking.customer?.fullName || "Customer",
      rating: booking.rating,
      comment: booking.review || "No comment provided",
      date: booking.updatedAt
        ? new Date(booking.updatedAt).toLocaleDateString()
        : "",
      service: booking.job?.title || booking.job?.category || "Service",
    }));

  // Calculate real stats from booking data
  const totalCompletedBookings =
    allBookings?.filter((booking) => booking.status === "completed")?.length ||
    0;
  const totalEarnings =
    allBookings
      ?.filter((booking) => booking.status === "completed")
      ?.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0) || 0;
  const totalRatedBookings =
    allBookings?.filter((booking) => booking.rating)?.length || 0;
  const averageRating =
    totalRatedBookings > 0
      ? (
          allBookings
            ?.filter((booking) => booking.rating)
            ?.reduce((sum, booking) => sum + booking.rating, 0) /
          totalRatedBookings
        ).toFixed(1)
      : "0.0";

  const stats = [
    {
      label: "Today's Bookings",
      value: bookingStats.todayBookings || todayBookings.length.toString(),
      icon: Calendar,
      color: "text-blue-600",
      change: "scheduled today",
    },
    {
      label: "Total Earnings",
      value: `$${bookingStats.totalEarnings || totalEarnings}`,
      icon: DollarSign,
      color: "text-green-600",
      change: "from completed jobs",
    },
    {
      label: "Average Rating",
      value: bookingStats.averageRating || averageRating,
      icon: Star,
      color: "text-yellow-600",
      change: `based on ${totalRatedBookings} reviews`,
    },
    {
      label: "Completed Jobs",
      value: bookingStats.completed || totalCompletedBookings.toString(),
      icon: CheckCircle,
      color: "text-purple-600",
      change: "jobs finished",
    },
  ];

  // Group upcoming bookings by date
  const groupedUpcomingJobs = upcomingBookings.reduce((groups, booking) => {
    if (!booking.scheduledDate) return groups;

    const bookingDate = new Date(booking.scheduledDate);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    let dateLabel;
    if (bookingDate.toDateString() === tomorrow.toDateString()) {
      dateLabel = "Tomorrow";
    } else {
      dateLabel = bookingDate.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
      });
    }

    if (!groups[dateLabel]) {
      groups[dateLabel] = [];
    }

    groups[dateLabel].push({
      time: booking.scheduledTime
        ? new Date(booking.scheduledTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "TBD",
      customer: booking.customer?.fullName || "Customer",
      service: booking.job?.title || booking.job?.category || "Service",
      amount: booking.totalAmount || booking.job?.budget || 0,
    });

    return groups;
  }, {});

  const upcomingJobs = Object.entries(groupedUpcomingJobs).map(
    ([date, jobs]) => ({
      date,
      jobs,
    }),
  );

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

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <UserAvatar user={user} size="3xl" className="hidden sm:flex" />
              <UserAvatar user={user} size="2xl" className="sm:hidden" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Good morning, {user?.fullName || user?.name}!
                </h1>
                <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                  Manage your services and track your earnings
                </p>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-1">
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full",
                        isAvailable
                          ? "bg-green-500 animate-pulse"
                          : "bg-gray-400",
                      )}
                    ></div>
                    <span
                      className={cn(
                        "text-xs font-medium",
                        isAvailable ? "text-green-600" : "text-gray-500",
                      )}
                    >
                      {isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Worker Dashboard
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Availability Toggle */}
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Available
                </span>
                <button
                  onClick={handleAvailabilityToggle}
                  disabled={updateProfileMutation.isPending}
                  className="focus:outline-none disabled:opacity-50"
                >
                  {isAvailable ? (
                    <ToggleRight className="w-8 h-8 text-green-600" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-gray-400" />
                  )}
                </button>
              </div>
              <Button variant="outline" asChild>
                <Link to="/worker/bookings">
                  <Calendar className="w-4 h-4 mr-2" />
                  My Bookings
                </Link>
              </Button>
              <Button asChild>
                <Link to="/worker/find-jobs">
                  <Search className="w-4 h-4 mr-2" />
                  Find Jobs
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/worker/profile">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Availability Status */}
        {!isAvailable && (
          <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-orange-600 mr-2" />
              <span className="text-orange-800 font-medium">
                You're currently unavailable. Toggle your availability to
                receive new bookings.
              </span>
            </div>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const gradients = [
              "bg-gradient-to-br from-blue-400 to-blue-600",
              "bg-gradient-to-br from-green-400 to-green-600",
              "bg-gradient-to-br from-yellow-400 to-yellow-600",
              "bg-gradient-to-br from-purple-400 to-purple-600",
            ];
            return (
              <Card
                key={index}
                className="card-gradient border-none shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.label}
                    </p>
                    <div
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center",
                        gradients[index],
                      )}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-foreground mb-1">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground">{stat.change}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Today's Schedule */}
          <div className="lg:col-span-2">
            <Card className="mb-6 card-gradient border-none shadow-xl">
              <CardHeader className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center text-lg">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                      <Calendar className="w-4 h-4 text-white" />
                    </div>
                    Today's Schedule
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="glass-effect border-green-200"
                  >
                    <Link to="/worker/calendar">
                      <Calendar className="w-4 h-4 mr-2" />
                      View Calendar
                    </Link>
                  </Button>
                </div>
                <CardDescription>Your bookings for today</CardDescription>
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
                ) : todayBookings.length > 0 ? (
                  <div className="space-y-4">
                    {todayBookings.map((booking) => (
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
                              Customer:{" "}
                              {booking.customer?.fullName || "Customer"}
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
                                <MapPin className="w-3 h-3 mr-1" />
                                {booking.job?.location ||
                                  booking.customer?.address?.city ||
                                  "Location TBD"}
                              </span>
                            </div>
                          </div>
                          <div className="text-right space-y-2">
                            <p className="font-semibold text-foreground">
                              ${booking.totalAmount || booking.job?.budget || 0}
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
                          <Button size="sm" variant="outline" asChild>
                            <Link to={`/worker/bookings/${booking._id}/chat`}>
                              <MessageCircle className="w-4 h-4 mr-1" />
                              Message
                            </Link>
                          </Button>
                          <Button size="sm" variant="outline" asChild>
                            <Link to={`/worker/bookings/${booking._id}`}>
                              <Eye className="w-4 h-4 mr-1" />
                              Details
                            </Link>
                          </Button>
                          {(booking.status === "upcoming" ||
                            booking.status === "accepted") && (
                            <Button size="sm" asChild>
                              <Link
                                to={`/worker/bookings/${booking._id}/start`}
                              >
                                Start Job
                              </Link>
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      No bookings scheduled for today
                    </p>
                    <Button variant="outline" className="mt-4">
                      Update Availability
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Upcoming Jobs */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Jobs</CardTitle>
                <CardDescription>
                  Your next scheduled appointments
                </CardDescription>
              </CardHeader>
              <CardContent>
                {bookingsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">
                      Loading upcoming jobs...
                    </p>
                  </div>
                ) : upcomingJobs.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">
                      No upcoming jobs scheduled
                    </p>
                    <Button variant="outline" asChild>
                      <Link to="/worker/find-jobs">Find More Jobs</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {upcomingJobs.map((day, dayIndex) => (
                      <div key={dayIndex}>
                        <h4 className="font-semibold text-foreground mb-3">
                          {day.date}
                        </h4>
                        <div className="space-y-3">
                          {day.jobs.map((job, jobIndex) => (
                            <div
                              key={jobIndex}
                              className="flex items-center justify-between p-3 bg-accent/30 rounded-lg"
                            >
                              <div>
                                <p className="font-medium text-foreground">
                                  {job.service}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {job.customer}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {job.time}
                                </p>
                              </div>
                              <p className="font-semibold text-foreground">
                                ${job.amount}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Reviews */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Star className="w-5 h-5 mr-2" />
                    Recent Reviews
                  </CardTitle>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/worker/reviews">View All</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {bookingsLoading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                    <p className="text-xs text-muted-foreground">
                      Loading reviews...
                    </p>
                  </div>
                ) : recentReviews.length === 0 ? (
                  <div className="text-center py-8">
                    <Star className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      No reviews yet
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Complete jobs to get reviews
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentReviews.map((review) => (
                      <div key={review.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-foreground text-sm">
                            {review.customerName}
                          </p>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={cn(
                                  "w-3 h-3",
                                  i < review.rating
                                    ? "text-yellow-500 fill-current"
                                    : "text-gray-300",
                                )}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {review.comment}
                        </p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{review.service}</span>
                          <span>{review.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <Link to="/worker/find-jobs">
                    <Search className="w-4 h-4 mr-2" />
                    Find Jobs
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Edit className="w-4 h-4 mr-2" />
                  Update Services
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  Set Availability
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <DollarSign className="w-4 h-4 mr-2" />
                  View Earnings
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Customer Messages
                </Button>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">New booking request</p>
                      <p className="text-xs text-muted-foreground">
                        2 hours ago
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">Payment received</p>
                      <p className="text-xs text-muted-foreground">
                        5 hours ago
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">New review posted</p>
                      <p className="text-xs text-muted-foreground">1 day ago</p>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4" size="sm">
                  View All Notifications
                </Button>
              </CardContent>
            </Card>

            {/* Performance Tips */}
            <Card className="border-blue-200 bg-blue-50/50">
              <CardHeader>
                <CardTitle className="text-blue-700">
                  <TrendingUp className="w-5 h-5 mr-2 inline" />
                  Performance Tip
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-blue-800 mb-3">
                  Respond to messages within 1 hour to improve your response
                  rate and get more bookings!
                </p>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Learn More
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}