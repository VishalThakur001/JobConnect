import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useJobById } from "../hooks/useJob";
import {
  useJobApplications,
  useUpdateApplicationStatus,
  useAcceptApplication,
} from "../hooks/useApplication";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  ArrowLeft,
  User,
  Star,
  Clock,
  DollarSign,
  Calendar,
  MessageCircle,
  Check,
  X,
  MapPin,
  Briefcase,
  Phone,
  Mail,
  Award,
} from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "../utils/cn";

export default function JobApplicationsPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [processingAppId, setProcessingAppId] = useState(null);

  const {
    data: job,
    isLoading: jobLoading,
    error: jobError,
  } = useJobById(jobId);
  const {
    data: applicationsData,
    isLoading: appsLoading,
    error: appsError,
    refetch,
  } = useJobApplications(jobId);
  const updateStatusMutation = useUpdateApplicationStatus();
  const acceptApplicationMutation = useAcceptApplication();

  const applications = applicationsData?.data || [];

  const handleStatusUpdate = async (applicationId, status) => {
    setProcessingAppId(applicationId);
    try {
      if (status === "accepted") {
        // Use accept application to create booking
        const result = await acceptApplicationMutation.mutateAsync({
          jobId,
          applicationId,
        });

        if (result.success) {
          toast.success(
            "Application accepted and booking created successfully!",
          );
          refetch();
        } else {
          toast.error(result.message || "Failed to accept application");
        }
      } else {
        // Use regular status update for rejection
        const result = await updateStatusMutation.mutateAsync({
          applicationId,
          status,
        });

        if (result.success) {
          toast.success("Application rejected successfully");
          refetch();
        } else {
          toast.error(result.message || "Failed to reject application");
        }
      }
    } catch (error) {
      toast.error(`Failed to ${status} application`);
    } finally {
      setProcessingAppId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "applied":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "accepted":
        return "text-green-600 bg-green-50 border-green-200";
      case "rejected":
        return "text-red-600 bg-red-50 border-red-200";
      case "confirmed":
        return "text-purple-600 bg-purple-50 border-purple-200";
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

  const formatDuration = (hours) => {
    if (hours < 1) {
      return `${Math.round(hours * 60)} minutes`;
    }
    return `${hours} hour${hours !== 1 ? "s" : ""}`;
  };

  if (jobLoading || appsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading applications...</p>
          </div>
        </div>
      </div>
    );
  }

  if (jobError || appsError) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-8">
            <p className="text-red-500">
              Failed to load data. Please try again.
            </p>
            <Button
              variant="outline"
              onClick={() => navigate("/customer/jobs")}
              className="mt-2"
            >
              Go Back
            </Button>
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
          <Button
            variant="ghost"
            onClick={() => navigate("/customer/jobs")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to My Jobs
          </Button>

          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Job Applications
            </h1>
            <p className="text-muted-foreground mt-1">
              Review and manage applications for your job post
            </p>
          </div>
        </div>

        {/* Job Summary */}
        {job && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Briefcase className="w-5 h-5 mr-2" />
                Job Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {job.title}
                  </h3>
                  <p className="text-muted-foreground">{job.description}</p>
                </div>

                <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                  <span className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {job.address?.city}, {job.address?.state}
                  </span>
                  <span className="flex items-center text-green-600 font-semibold">
                    <DollarSign className="w-4 h-4 mr-1" />₹
                    {job.budget?.toLocaleString()}
                  </span>
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Posted {formatDate(job.createdAt)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Applications List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">
              Applications ({applications.length})
            </h2>
          </div>

          {applications.length === 0 ? (
            <Card>
              <CardContent className="p-8">
                <div className="text-center">
                  <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No applications yet
                  </h3>
                  <p className="text-muted-foreground">
                    Workers haven't applied for this job yet. Check back later!
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {applications.map((application) => (
                <Card
                  key={application._id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Worker Info Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                            <span className="text-secondary-foreground font-semibold">
                              {application.workerId?.fullName
                                ?.charAt(0)
                                ?.toUpperCase() || "W"}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-foreground">
                              {application.workerId?.fullName || "Worker"}
                            </h3>
                            <p className="text-sm text-muted-foreground capitalize">
                              {application.workerId?.profession ||
                                "Professional"}
                            </p>
                            <div className="flex items-center text-sm text-muted-foreground mt-1">
                              <Star className="w-4 h-4 mr-1 text-yellow-500" />
                              <span>4.8 (25 reviews)</span>
                            </div>
                          </div>
                        </div>

                        <span
                          className={cn(
                            "px-3 py-1 rounded-full text-xs font-medium border capitalize",
                            getStatusColor(application.status),
                          )}
                        >
                          {application.status}
                        </span>
                      </div>

                      {/* Application Details */}
                      <div className="bg-accent/30 rounded-lg p-4">
                        <h4 className="font-medium text-foreground mb-2">
                          Cover Message
                        </h4>
                        <p className="text-muted-foreground">
                          {application.message}
                        </p>
                      </div>

                      {/* Proposal Details */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-green-50 rounded-lg p-4">
                          <div className="flex items-center text-green-600 mb-1">
                            <DollarSign className="w-4 h-4 mr-1" />
                            <span className="font-medium">Proposed Amount</span>
                          </div>
                          <p className="text-lg font-bold text-green-700">
                            ₹{application.proposedAmount?.toLocaleString()}
                          </p>
                        </div>

                        {application.estimatedDuration && (
                          <div className="bg-blue-50 rounded-lg p-4">
                            <div className="flex items-center text-blue-600 mb-1">
                              <Clock className="w-4 h-4 mr-1" />
                              <span className="font-medium">Duration</span>
                            </div>
                            <p className="text-lg font-bold text-blue-700">
                              {formatDuration(application.estimatedDuration)}
                            </p>
                          </div>
                        )}

                        {application.proposedSchedule?.preferredTime && (
                          <div className="bg-purple-50 rounded-lg p-4">
                            <div className="flex items-center text-purple-600 mb-1">
                              <Calendar className="w-4 h-4 mr-1" />
                              <span className="font-medium">
                                Preferred Time
                              </span>
                            </div>
                            <p className="text-lg font-bold text-purple-700 capitalize">
                              {application.proposedSchedule.preferredTime}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Additional Info */}
                      {application.proposedSchedule?.startDate && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>
                            Available from:{" "}
                            {formatDate(application.proposedSchedule.startDate)}
                          </span>
                        </div>
                      )}

                      {application.notes && (
                        <div className="border-l-4 border-primary pl-4">
                          <h5 className="font-medium text-foreground mb-1">
                            Additional Notes
                          </h5>
                          <p className="text-muted-foreground text-sm">
                            {application.notes}
                          </p>
                        </div>
                      )}

                      {/* Application Date */}
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="w-3 h-3 mr-1" />
                        Applied on {formatDate(application.createdAt)}
                      </div>

                      {/* Action Buttons */}
                      {application.status === "applied" && (
                        <div className="flex items-center space-x-3 pt-4 border-t">
                          <Button
                            onClick={() =>
                              handleStatusUpdate(application._id, "accepted")
                            }
                            disabled={processingAppId === application._id}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Check className="w-4 h-4 mr-2" />
                            {processingAppId === application._id
                              ? "Processing..."
                              : "Accept"}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() =>
                              handleStatusUpdate(application._id, "rejected")
                            }
                            disabled={processingAppId === application._id}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="w-4 h-4 mr-2" />
                            {processingAppId === application._id
                              ? "Processing..."
                              : "Reject"}
                          </Button>
                          <Button variant="outline" size="sm">
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Message Worker
                          </Button>
                        </div>
                      )}

                      {application.status === "accepted" && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <div className="flex items-center text-green-700">
                            <Check className="w-5 h-5 mr-2" />
                            <span className="font-medium">
                              Application Accepted
                            </span>
                          </div>
                          <p className="text-sm text-green-600 mt-1">
                            This worker has been selected for your job. The job
                            status has been updated to "assigned".
                          </p>
                        </div>
                      )}

                      {application.status === "rejected" && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                          <div className="flex items-center text-red-700">
                            <X className="w-5 h-5 mr-2" />
                            <span className="font-medium">
                              Application Rejected
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}