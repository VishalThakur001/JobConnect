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

export default function CustomerHomePage() {
  const { user } = useSelector((state) => state.user);
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data - replace with real API calls
  const recentBookings = [
    {
      id: 1,
      serviceName: "Home Cleaning",
      workerName: "Sarah Johnson",
      date: "2024-01-15",
      time: "10:00 AM",
      status: "completed",
      rating: 5,
      amount: 150,
    },
    {
      id: 2,
      serviceName: "Plumbing Repair",
      workerName: "Mike Wilson",
      date: "2024-01-20",
      time: "2:00 PM",
      status: "upcoming",
      amount: 200,
    },
    {
      id: 3,
      serviceName: "Electrical Work",
      workerName: "David Chen",
      date: "2024-01-10",
      time: "9:00 AM",
      status: "in-progress",
      amount: 180,
    },
  ];

  const popularServices = [
    { name: "Home Cleaning", icon: "🏠", bookings: 145 },
    { name: "Plumbing", icon: "🔧", bookings: 98 },
    { name: "Electrical", icon: "⚡", bookings: 87 },
    { name: "Gardening", icon: "🌱", bookings: 76 },
    { name: "Moving", icon: "📦", bookings: 65 },
    { name: "Pet Care", icon: "🐕", bookings: 54 },
  ];

  const stats = [
    {
      label: "Total Bookings",
      value: "12",
      icon: Calendar,
      color: "text-blue-600",
    },
    {
      label: "Completed",
      value: "8",
      icon: CheckCircle,
      color: "text-green-600",
    },
    { label: "Upcoming", value: "2", icon: Clock, color: "text-orange-600" },
    { label: "Favorites", value: "5", icon: Heart, color: "text-red-600" },
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
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Welcome back, {user?.fullName || user?.name}!
              </h1>
              <p className="text-muted-foreground mt-1">
                Find and manage your service bookings
              </p>
            </div>
            <Button asChild>
              <Link to="/book-service">
                <Plus className="w-4 h-4 mr-2" />
                Book Service
              </Link>
            </Button>
          </div>
        </div>

        {/* Quick Search */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="w-5 h-5 mr-2" />
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
            return (
              <Card key={index}>
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
                    <Icon className={cn("w-6 h-6", stat.color)} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Bookings */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Bookings</CardTitle>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/customer/bookings">View All</Link>
                  </Button>
                </div>
                <CardDescription>
                  Your latest service bookings and their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentBookings.map((booking) => {
                    const StatusIcon = getStatusIcon(booking.status);
                    return (
                      <div
                        key={booking.id}
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
                              {booking.serviceName}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              with {booking.workerName}
                            </p>
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                              <span className="flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                {booking.date}
                              </span>
                              <span className="flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {booking.time}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-foreground">
                            ${booking.amount}
                          </p>
                          {booking.rating && (
                            <div className="flex items-center text-yellow-500 text-sm">
                              <Star className="w-3 h-3 mr-1 fill-current" />
                              {booking.rating}
                            </div>
                          )}
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
                    );
                  })}
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
                <Button variant="outline" className="w-full justify-start">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Message Workers
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Heart className="w-4 h-4 mr-2" />
                  View Favorites
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <User className="w-4 h-4 mr-2" />
                  Update Profile
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Star className="w-4 h-4 mr-2" />
                  Leave Reviews
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
