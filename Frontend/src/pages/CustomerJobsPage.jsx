import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMyJobPosts, useDeleteJob } from "../hooks/useJob";
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
  Eye,
  Edit,
  Trash2,
  Plus,
  Users,
  AlertCircle,
  CheckCircle,
  Clock,
  MoreVertical,
} from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "../utils/cn";

export default function CustomerJobsPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [deletingJobId, setDeletingJobId] = useState(null);

  const { data: jobsData, isLoading, error, refetch } = useMyJobPosts(page, 10);
  const deleteJobMutation = useDeleteJob();

  const jobs = jobsData?.jobs || [];
  const pagination = jobsData?.pagination || {};

  const getStatusIcon = (status) => {
    switch (status) {
      case "open":
        return Clock;
      case "assigned":
        return Users;
      case "completed":
        return CheckCircle;
      case "cancelled":
        return AlertCircle;
      default:
        return Clock;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "assigned":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "completed":
        return "text-green-600 bg-green-50 border-green-200";
      case "cancelled":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job post?")) {
      return;
    }

    setDeletingJobId(jobId);
    try {
      const result = await deleteJobMutation.mutateAsync(jobId);
      if (result.success) {
        toast.success("Job deleted successfully");
        refetch();
      } else {
        toast.error(result.message || "Failed to delete job");
      }
    } catch (error) {
      toast.error("Failed to delete job");
    } finally {
      setDeletingJobId(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading your job posts...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-8">
            <p className="text-red-500">
              Failed to load job posts. Please try again.
            </p>
            <Button
              variant="outline"
              onClick={() => refetch()}
              className="mt-2"
            >
              Retry
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Job Posts</h1>
            <p className="text-muted-foreground mt-1">
              Manage your job posts and view applications
            </p>
          </div>
          <Button asChild>
            <Link to="/customer/post-job">
              <Plus className="w-4 h-4 mr-2" />
              Post New Job
            </Link>
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Jobs
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {pagination.total || 0}
                  </p>
                </div>
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Open
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {jobs.filter((job) => job.status === "open").length}
                  </p>
                </div>
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Assigned
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {jobs.filter((job) => job.status === "assigned").length}
                  </p>
                </div>
                <Users className="w-6 h-6 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Completed
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {jobs.filter((job) => job.status === "completed").length}
                  </p>
                </div>
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Jobs List */}
        {jobs.length === 0 ? (
          <Card>
            <CardContent className="p-8">
              <div className="text-center">
                <Plus className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No job posts yet
                </h3>
                <p className="text-muted-foreground mb-4">
                  Start by posting your first job to connect with skilled
                  workers
                </p>
                <Button asChild>
                  <Link to="/customer/post-job">
                    <Plus className="w-4 h-4 mr-2" />
                    Post Your First Job
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => {
              const StatusIcon = getStatusIcon(job.status);
              return (
                <Card
                  key={job._id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-foreground">
                            {job.title}
                          </h3>
                          <span
                            className={cn(
                              "px-3 py-1 rounded-full text-xs font-medium border capitalize",
                              getStatusColor(job.status),
                            )}
                          >
                            <StatusIcon className="w-3 h-3 mr-1 inline" />
                            {job.status}
                          </span>
                        </div>

                        <p className="text-muted-foreground mb-3 line-clamp-2">
                          {job.description}
                        </p>

                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            Posted {formatDate(job.createdAt)}
                          </span>
                          <span className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {job.address?.city}, {job.address?.state}
                          </span>
                          <span className="flex items-center text-green-600 font-semibold">
                            <DollarSign className="w-4 h-4 mr-1" />₹
                            {job.budget?.toLocaleString()}
                          </span>
                        </div>

                        {job.assignedWorker && (
                          <div className="flex items-center space-x-2 mb-4 p-3 bg-orange-50 rounded-lg">
                            <Users className="w-4 h-4 text-orange-600" />
                            <span className="text-sm text-orange-800">
                              Assigned to:{" "}
                              <strong>{job.assignedWorker.fullName}</strong>
                            </span>
                          </div>
                        )}

                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/customer/jobs/${job._id}/applications`}>
                              <Eye className="w-4 h-4 mr-1" />
                              View Applications
                            </Link>
                          </Button>

                          {job.status === "open" && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  navigate(`/customer/jobs/${job._id}/edit`)
                                }
                              >
                                <Edit className="w-4 h-4 mr-1" />
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteJob(job._id)}
                                disabled={deletingJobId === job._id}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4 mr-1" />
                                {deletingJobId === job._id
                                  ? "Deleting..."
                                  : "Delete"}
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-center space-x-2 mt-8">
            <Button
              variant="outline"
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1}
            >
              Previous
            </Button>

            <div className="flex items-center space-x-1">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
                (pageNum) => (
                  <Button
                    key={pageNum}
                    variant={page === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </Button>
                ),
              )}
            </div>

            <Button
              variant="outline"
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= pagination.pages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}