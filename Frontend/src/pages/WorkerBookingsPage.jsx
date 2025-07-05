import { useState } from "react";
import { Link } from "react-router-dom";
import { useWorkerBookings, useUpdateBookingStatus } from "../hooks/useBooking";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  User,
  Phone,
  Star,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowLeft,
  Play,
  Check,
} from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "../utils/cn";

export default function WorkerBookingsPage() {
  const [statusFilter, setStatusFilter] = useState("");
  const [processingBookingId, setProcessingBookingId] = useState(null);

  const {
    data: bookingsData,
    isLoading,
    error,
    refetch,
  } = useWorkerBookings(statusFilter);
  const updateStatusMutation = useUpdateBookingStatus();

  const bookings = bookingsData || [];

  const handleStatusUpdate = async (bookingId, status) => {
    setProcessingBookingId(bookingId);
    try {
      const result = await updateStatusMutation.mutateAsync({
        bookingId,
        status,
      });

      if (result.success) {
        toast.success(`Booking ${status} successfully`);
        refetch();
      } else {
        toast.error(result.message || `Failed to ${status} booking`);
      }
    } catch (error) {
      toast.error(`Failed to ${status} booking`);
    } finally {
      setProcessingBookingId(null);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return Clock;
      case "accepted":
        return CheckCircle;
      case "rejected":
        return XCircle;
      case "in-progress":
        return AlertCircle;
      case "completed":
        return CheckCircle;
      case "cancelled":
        return XCircle;
      default:
        return Clock;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "accepted":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "rejected":
        return "text-red-600 bg-red-50 border-red-200";
      case "in-progress":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "completed":
        return "text-green-600 bg-green-50 border-green-200";
      case "cancelled":
        return "text-gray-600 bg-gray-50 border-gray-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getAvailableActions = (booking) => {
    const actions = [];

    switch (booking.status) {
      case "pending":
        actions.push(
          {
            label: "Accept",
            action: "accepted",
            variant: "default",
            icon: CheckCircle,
          },
          {
            label: "Reject",
            action: "rejected",
            variant: "outline",
            icon: XCircle,
          },
        );
        break;
      case "accepted":
        actions.push(
          {
            label: "Start Work",
            action: "in-progress",
            variant: "default",
            icon: Play,
          },
          {
            label: "Cancel",
            action: "cancelled",
            variant: "outline",
            icon: XCircle,
          },
        );
        break;
      case "in-progress":
        actions.push({
          label: "Complete",
          action: "completed",
          variant: "default",
          icon: Check,
        });
        break;
    }

    return actions;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Loading bookings...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-red-600">
            Error loading bookings: {error.message}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                My Bookings
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage your service bookings
              </p>
            </div>
            <Button asChild variant="outline">
              <Link to="/worker/home">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </div>
        </div>

        {/* Status Filter */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={statusFilter === "" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("")}
            >
              All
            </Button>
            <Button
              variant={statusFilter === "pending" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("pending")}
            >
              Pending
            </Button>
            <Button
              variant={statusFilter === "accepted" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("accepted")}
            >
              Accepted
            </Button>
            <Button
              variant={statusFilter === "in-progress" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("in-progress")}
            >
              In Progress
            </Button>
            <Button
              variant={statusFilter === "completed" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("completed")}
            >
              Completed
            </Button>
          </div>
        </div>

        {/* Bookings List */}
        {bookings.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No bookings found
              </h3>
              <p className="text-muted-foreground mb-4">
                You don't have any bookings yet.
              </p>
              <Button asChild>
                <Link to="/worker/find-jobs">Find Jobs</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {bookings.map((booking) => {
              const StatusIcon = getStatusIcon(booking.status);
              const isProcessing = processingBookingId === booking._id;
              const availableActions = getAvailableActions(booking);

              return (
                <Card key={booking._id} className="overflow-hidden">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <CardTitle className="text-lg">
                          {booking.serviceCategory.charAt(0).toUpperCase() +
                            booking.serviceCategory.slice(1).replace("-", " ")}
                        </CardTitle>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(booking.scheduledDate)}
                          </span>
                          <span className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-1" />$
                            {booking.amount}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={cn(
                            "px-3 py-1 rounded-full text-xs font-medium border capitalize",
                            getStatusColor(booking.status),
                          )}
                        >
                          <StatusIcon className="w-3 h-3 mr-1 inline" />
                          {booking.status.replace("-", " ")}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Customer Info */}
                      <div className="flex items-center space-x-3 p-3 bg-accent/30 rounded-lg">
                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {booking.customerId?.fullName || "Customer"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {booking.customerId?.email || "No email provided"}
                          </p>
                        </div>
                      </div>

                      {/* Description */}
                      {booking.description && (
                        <div>
                          <h4 className="font-medium text-foreground mb-2">
                            Description
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {booking.description}
                          </p>
                        </div>
                      )}

                      {/* Earnings */}
                      {booking.workerEarning > 0 && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-sm font-medium text-green-800">
                            Your Earnings: ${booking.workerEarning}
                          </p>
                        </div>
                      )}

                      {/* Actions */}
                      {availableActions.length > 0 && (
                        <div className="flex items-center space-x-2 pt-2">
                          {availableActions.map((action, index) => {
                            const ActionIcon = action.icon;
                            return (
                              <Button
                                key={index}
                                variant={action.variant}
                                size="sm"
                                onClick={() =>
                                  handleStatusUpdate(booking._id, action.action)
                                }
                                disabled={isProcessing}
                              >
                                <ActionIcon className="w-4 h-4 mr-1" />
                                {action.label}
                              </Button>
                            );
                          })}
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}