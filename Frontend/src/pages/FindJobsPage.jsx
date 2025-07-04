import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNearbyJobs } from "../hooks/useJob";
import { useApplyToJob } from "../hooks/useApplication";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Search,
  MapPin,
  DollarSign,
  Clock,
  Calendar,
  Filter,
  Briefcase,
  User,
  MessageCircle,
  Send,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

const serviceCategories = [
  { value: "", label: "All Categories" },
  { value: "plumber", label: "Plumber", icon: "🔧" },
  { value: "electrician", label: "Electrician", icon: "⚡" },
  { value: "carpenter", label: "Carpenter", icon: "🔨" },
  { value: "painter", label: "Painter", icon: "🎨" },
  { value: "mason", label: "Mason", icon: "🧱" },
  { value: "technician", label: "Technician", icon: "⚙️" },
  { value: "home-cleaner", label: "Home Cleaner", icon: "🏠" },
  { value: "mechanic", label: "Mechanic", icon: "🚗" },
];

export default function FindJobsPage() {
  const [filters, setFilters] = useState({
    profession: "",
    budget: { min: "", max: "" },
    radius: 10000,
    page: 1,
    limit: 10,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);

  const { data: jobs = [], isLoading, error, refetch } = useNearbyJobs(filters);
  const applyToJobMutation = useApplyToJob();

  const {
    register: registerFilters,
    handleSubmit: handleFilterSubmit,
    watch: watchFilters,
    reset: resetFilters,
  } = useForm({
    defaultValues: filters,
  });

  const {
    register: registerApplication,
    handleSubmit: handleApplicationSubmit,
    formState: { errors: applicationErrors },
    reset: resetApplication,
  } = useForm({
    defaultValues: {
      message: "",
      proposedAmount: "",
      estimatedDuration: "",
      proposedSchedule: {
        startDate: "",
        preferredTime: "",
      },
      notes: "",
    },
  });

  const applyFilters = (filterData) => {
    setFilters({
      ...filterData,
      budget: {
        min: filterData.budgetMin || "",
        max: filterData.budgetMax || "",
      },
      page: 1,
    });
    setShowFilters(false);
  };

  const clearFilters = () => {
    const defaultFilters = {
      profession: "",
      budget: { min: "", max: "" },
      radius: 10000,
      page: 1,
      limit: 10,
    };
    setFilters(defaultFilters);
    resetFilters(defaultFilters);
  };

  const openApplicationModal = (job) => {
    setSelectedJob(job);
    setShowApplicationModal(true);
  };

  const closeApplicationModal = () => {
    setShowApplicationModal(false);
    setSelectedJob(null);
    resetApplication();
  };

  const submitApplication = async (applicationData) => {
    if (!selectedJob) return;

    try {
      const result = await applyToJobMutation.mutateAsync({
        jobId: selectedJob._id,
        data: {
          message: applicationData.message,
          proposedAmount: parseFloat(applicationData.proposedAmount),
          estimatedDuration: applicationData.estimatedDuration
            ? parseFloat(applicationData.estimatedDuration)
            : undefined,
          proposedSchedule: {
            startDate: applicationData.proposedSchedule.startDate || undefined,
            preferredTime:
              applicationData.proposedSchedule.preferredTime || undefined,
          },
          notes: applicationData.notes || undefined,
        },
      });

      if (result.success) {
        toast.success("Application submitted successfully!");
        closeApplicationModal();
        refetch(); // Refresh jobs list
      } else {
        toast.error(result.message || "Failed to submit application");
      }
    } catch (error) {
      toast.error("Failed to submit application. Please try again.");
    }
  };

  const formatDistance = (distance) => {
    if (distance < 1000) {
      return `${Math.round(distance)}m away`;
    }
    return `${(distance / 1000).toFixed(1)}km away`;
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffMs = now - postDate;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    } else {
      return "Just posted";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Find Jobs</h1>
            <p className="text-muted-foreground mt-1">
              Discover opportunities near you and apply for jobs
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Filter Jobs</span>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleFilterSubmit(applyFilters)}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Service Category */}
                  <div>
                    <Label htmlFor="profession">Service Category</Label>
                    <select
                      id="profession"
                      {...registerFilters("profession")}
                      className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      {serviceCategories.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Budget Range */}
                  <div>
                    <Label>Budget Range (₹)</Label>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Min"
                        type="number"
                        {...registerFilters("budgetMin")}
                      />
                      <Input
                        placeholder="Max"
                        type="number"
                        {...registerFilters("budgetMax")}
                      />
                    </div>
                  </div>

                  {/* Radius */}
                  <div>
                    <Label htmlFor="radius">Search Radius</Label>
                    <select
                      id="radius"
                      {...registerFilters("radius")}
                      className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value={5000}>5 km</option>
                      <option value={10000}>10 km</option>
                      <option value={20000}>20 km</option>
                      <option value={50000}>50 km</option>
                    </select>
                  </div>

                  {/* Apply Button */}
                  <div className="flex items-end">
                    <Button type="submit" className="w-full">
                      <Search className="w-4 h-4 mr-2" />
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Jobs List */}
        <div className="space-y-4">
          {isLoading && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading jobs...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <p className="text-red-500">
                Failed to load jobs. Please try again.
              </p>
              <Button
                variant="outline"
                onClick={() => refetch()}
                className="mt-2"
              >
                Retry
              </Button>
            </div>
          )}

          {!isLoading && !error && jobs.length === 0 && (
            <div className="text-center py-8">
              <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                No jobs found in your area.
              </p>
              <Button variant="outline" onClick={clearFilters} className="mt-2">
                Clear Filters
              </Button>
            </div>
          )}

          {jobs.map((job) => (
            <Card key={job._id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">
                        {job.title}
                      </h3>
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs capitalize">
                        {job.serviceCategory.replace("-", " ")}
                      </span>
                    </div>

                    <p className="text-muted-foreground mb-3 line-clamp-2">
                      {job.description}
                    </p>

                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {job.address?.city}, {job.address?.state}
                        {job.distance && ` • ${formatDistance(job.distance)}`}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatTimeAgo(job.createdAt)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center text-green-600 font-semibold">
                          <DollarSign className="w-4 h-4 mr-1" />₹
                          {job.budget?.toLocaleString()}
                        </span>
                        <span className="flex items-center text-muted-foreground text-sm">
                          <User className="w-4 h-4 mr-1" />
                          {job.customerId?.fullName || "Customer"}
                        </span>
                      </div>
                      <Button
                        onClick={() => openApplicationModal(job)}
                        className="flex items-center"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Apply Now
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Application Modal */}
        {showApplicationModal && selectedJob && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-background rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold">Apply for Job</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={closeApplicationModal}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Job Summary */}
                <Card className="mb-6">
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2">{selectedJob.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      {selectedJob.description}
                    </p>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-green-600 font-semibold">
                        ₹{selectedJob.budget?.toLocaleString()}
                      </span>
                      <span>
                        {selectedJob.address?.city},{" "}
                        {selectedJob.address?.state}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Application Form */}
                <form
                  onSubmit={handleApplicationSubmit(submitApplication)}
                  className="space-y-4"
                >
                  <div>
                    <Label htmlFor="message">Cover Message *</Label>
                    <textarea
                      id="message"
                      rows={4}
                      placeholder="Explain why you're the right person for this job..."
                      className={`w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring ${
                        applicationErrors.message ? "border-red-500" : ""
                      }`}
                      {...registerApplication("message", {
                        required: "Cover message is required",
                        maxLength: {
                          value: 1000,
                          message: "Message cannot exceed 1000 characters",
                        },
                      })}
                    />
                    {applicationErrors.message && (
                      <p className="text-red-500 text-sm mt-1">
                        {applicationErrors.message.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="proposedAmount">Your Quote (₹) *</Label>
                    <Input
                      id="proposedAmount"
                      type="number"
                      placeholder="Enter your proposed amount"
                      {...registerApplication("proposedAmount", {
                        required: "Proposed amount is required",
                        min: {
                          value: 50,
                          message: "Amount must be at least ₹50",
                        },
                      })}
                      className={
                        applicationErrors.proposedAmount ? "border-red-500" : ""
                      }
                    />
                    {applicationErrors.proposedAmount && (
                      <p className="text-red-500 text-sm mt-1">
                        {applicationErrors.proposedAmount.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="estimatedDuration">
                        Estimated Duration (hours)
                      </Label>
                      <Input
                        id="estimatedDuration"
                        type="number"
                        step="0.5"
                        placeholder="e.g., 2.5"
                        {...registerApplication("estimatedDuration")}
                      />
                    </div>

                    <div>
                      <Label htmlFor="preferredTime">Preferred Time</Label>
                      <select
                        id="preferredTime"
                        {...registerApplication(
                          "proposedSchedule.preferredTime",
                        )}
                        className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="">Select time</option>
                        <option value="morning">Morning (9 AM - 12 PM)</option>
                        <option value="afternoon">
                          Afternoon (12 PM - 4 PM)
                        </option>
                        <option value="evening">Evening (4 PM - 8 PM)</option>
                        <option value="flexible">Flexible</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="startDate">Earliest Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      {...registerApplication("proposedSchedule.startDate")}
                    />
                  </div>

                  <div>
                    <Label htmlFor="notes">Additional Notes</Label>
                    <textarea
                      id="notes"
                      rows={3}
                      placeholder="Any additional information or requirements..."
                      className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                      {...registerApplication("notes", {
                        maxLength: {
                          value: 500,
                          message: "Notes cannot exceed 500 characters",
                        },
                      })}
                    />
                    {applicationErrors.notes && (
                      <p className="text-red-500 text-sm mt-1">
                        {applicationErrors.notes.message}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={closeApplicationModal}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={applyToJobMutation.isPending}
                      className="min-w-[120px]"
                    >
                      {applyToJobMutation.isPending
                        ? "Submitting..."
                        : "Submit Application"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}