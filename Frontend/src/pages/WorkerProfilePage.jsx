import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Star,
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  Award,
  Briefcase,
  Phone,
  Mail,
  User,
  CheckCircle,
  TrendingUp,
  DollarSign,
  MessageCircle,
  Eye,
  Shield,
  Home,
  ThumbsUp,
  BarChart3,
  Target,
  Filter,
  Search,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";
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
import { useGetWorkerById } from "../hooks/useProfile";
import { useWorkerReviewsById } from "../hooks/useReview";
import UserAvatar from "../components/UserAvatar";

export default function WorkerProfilePage() {
  const { workerId } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRating, setFilterRating] = useState("");

  // Fetch worker details and their reviews
  const {
    data: workerDetails,
    isLoading: workerLoading,
    error: workerError,
  } = useGetWorkerById(workerId);

  console.log(workerDetails);

  // Get worker's reviews directly
  const { data: reviewsResponse, isLoading: reviewsLoading } =
    useWorkerReviewsById(workerId);

  // Extract reviews from the response
  const workerReviews = reviewsResponse?.data || [];

  // Filter reviews based on search and rating
  const filteredReviews = workerReviews.filter((review) => {
    const matchesSearch =
      !searchQuery ||
      review.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.comment?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.service?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRating =
      !filterRating || review.rating === parseInt(filterRating);

    return matchesSearch && matchesRating;
  });

  const renderStars = (rating, size = "sm") => {
    const starSize = size === "lg" ? "w-5 h-5" : "w-4 h-4";
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              starSize,
              star <= (rating || 0)
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300",
            )}
          />
        ))}
      </div>
    );
  };

  const formatAddress = (address) => {
    if (!address) return "Location not specified";
    return `${address.city || ""}, ${address.state || ""}`.replace(
      /^, |, $/,
      "",
    );
  };

  const getExperienceLevel = (years) => {
    if (years >= 5)
      return { level: "Expert", color: "text-green-600 bg-green-50" };
    if (years >= 2)
      return { level: "Experienced", color: "text-blue-600 bg-blue-50" };
    return { level: "Beginner", color: "text-yellow-600 bg-yellow-50" };
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return "text-green-600 bg-green-50";
    if (rating >= 4) return "text-blue-600 bg-blue-50";
    if (rating >= 3) return "text-yellow-600 bg-yellow-50";
    if (rating >= 2) return "text-orange-600 bg-orange-50";
    return "text-red-600 bg-red-50";
  };

  // Calculate rating distribution
  const totalReviews = workerReviews.length;
  const averageRating =
    totalReviews > 0
      ? (
          workerReviews.reduce((sum, review) => sum + review.rating, 0) /
          totalReviews
        ).toFixed(1)
      : workerDetails?.averageRating?.toFixed(1) || "0.0";

  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: workerReviews.filter((review) => review.rating === rating).length,
    percentage:
      totalReviews > 0
        ? Math.round(
            (workerReviews.filter((review) => review.rating === rating).length /
              totalReviews) *
              100,
          )
        : 0,
  }));

  if (workerLoading || reviewsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading worker profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (workerError) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Worker Not Found
            </h2>
            <p className="text-muted-foreground mb-4">
              The worker profile could not be loaded
            </p>
            <Button onClick={() => navigate(-1)}>Go Back</Button>
          </div>
        </div>
      </div>
    );
  }

  if (!workerDetails) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Worker Not Found
            </h2>
            <p className="text-muted-foreground mb-4">
              This worker profile doesn't exist
            </p>
            <Button onClick={() => navigate(-1)}>Go Back</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Back Button */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>

        {/* Worker Profile Header */}
        <Card className="mb-8 border-none shadow-xl bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-8 space-y-6 lg:space-y-0">
              <div className="flex-shrink-0 text-center lg:text-left">
                <UserAvatar
                  user={workerDetails}
                  size="4xl"
                  className="border-4 border-white shadow-lg mx-auto lg:mx-0"
                />
              </div>

              <div className="flex-1 text-center lg:text-left">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                  <h1 className="text-3xl font-bold text-foreground mb-2 lg:mb-0">
                    {workerDetails.fullName || "Worker"}
                  </h1>
                  <div className="flex items-center justify-center lg:justify-end space-x-2">
                    {workerDetails.isVerified && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Verified
                      </span>
                    )}
                    {workerDetails.isAvailable ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" />
                        Available
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                        <div className="w-2 h-2 bg-gray-500 rounded-full mr-1" />
                        Busy
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xl text-muted-foreground capitalize font-medium mb-6">
                  {workerDetails.profession || "Professional Service Provider"}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-2">
                    <div className="flex items-center justify-center lg:justify-start mb-2 lg:mb-0">
                      {renderStars(parseFloat(averageRating), "lg")}
                    </div>
                    <div className="text-center lg:text-left">
                      <span className="text-2xl font-bold text-foreground">
                        {averageRating}
                      </span>
                      <span className="text-sm text-muted-foreground ml-1">
                        ({totalReviews || workerDetails.totalReviews || 0}{" "}
                        reviews)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center lg:justify-start space-x-2 text-muted-foreground">
                    <MapPin className="w-5 h-5" />
                    <span>{formatAddress(workerDetails.address)}</span>
                  </div>

                  <div className="flex items-center justify-center lg:justify-start space-x-2 text-muted-foreground">
                    <Calendar className="w-5 h-5" />
                    <span>
                      Joined{" "}
                      {new Date(
                        workerDetails.createdAt || Date.now(),
                      ).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                  <Button className="flex-1 sm:flex-none">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message Worker
                  </Button>
                  <Button variant="outline" className="flex-1 sm:flex-none">
                    <Phone className="w-4 h-4 mr-2" />
                    Contact
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="text-center card-gradient border-none shadow-lg">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-foreground">
                {workerDetails.completedJobs || 0}
              </p>
              <p className="text-sm text-muted-foreground">Jobs Completed</p>
            </CardContent>
          </Card>

          <Card className="text-center card-gradient border-none shadow-lg">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-foreground">
                ${workerDetails.totalEarnings || 0}
              </p>
              <p className="text-sm text-muted-foreground">Total Earned</p>
            </CardContent>
          </Card>

          <Card className="text-center card-gradient border-none shadow-lg">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <p className="text-2xl font-bold text-foreground">
                {workerDetails.experienceYears || 0}
              </p>
              <p className="text-sm text-muted-foreground">Years Experience</p>
            </CardContent>
          </Card>

          <Card className="text-center card-gradient border-none shadow-lg">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-foreground">
                {Math.round(workerDetails.successRate || 95)}%
              </p>
              <p className="text-sm text-muted-foreground">Success Rate</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Professional Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Professional Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="w-5 h-5 mr-2" />
                  Professional Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {workerDetails.experienceYears && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Experience Level
                        </span>
                        <span
                          className={cn(
                            "px-3 py-1 rounded-full text-sm font-medium",
                            getExperienceLevel(workerDetails.experienceYears)
                              .color,
                          )}
                        >
                          {
                            getExperienceLevel(workerDetails.experienceYears)
                              .level
                          }
                        </span>
                      </div>
                    )}

                    {workerDetails.bookingsAday && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Max Bookings/Day
                        </span>
                        <span className="font-medium">
                          {workerDetails.bookingsAday}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Member Since
                      </span>
                      <span className="font-medium">
                        {new Date(
                          workerDetails.createdAt || Date.now(),
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {workerDetails.email && (
                      <div className="flex items-center space-x-3">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{workerDetails.email}</span>
                      </div>
                    )}

                    {workerDetails.phoneNumber && (
                      <div className="flex items-center space-x-3">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">
                          {workerDetails.phoneNumber}
                        </span>
                      </div>
                    )}

                    {workerDetails.address && (
                      <div className="flex items-start space-x-3">
                        <Home className="w-4 h-4 text-muted-foreground mt-0.5" />
                        <div className="text-sm">
                          {workerDetails.address.street && (
                            <div>{workerDetails.address.street}</div>
                          )}
                          <div>
                            {workerDetails.address.city},{" "}
                            {workerDetails.address.state}
                          </div>
                          {workerDetails.address.pincode && (
                            <div>{workerDetails.address.pincode}</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {workerDetails.availabilityTimes && (
                  <div className="mt-6 pt-6 border-t">
                    <h4 className="text-sm font-medium text-muted-foreground mb-3">
                      Availability
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(workerDetails.availabilityTimes).map(
                        ([day, available]) =>
                          available && (
                            <span
                              key={day}
                              className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full capitalize"
                            >
                              {day}
                            </span>
                          ),
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Reviews Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Star className="w-5 h-5 mr-2" />
                    Customer Reviews ({totalReviews})
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <Input
                      placeholder="Search reviews..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <select
                    value={filterRating}
                    onChange={(e) => setFilterRating(e.target.value)}
                    className="px-3 py-2 border rounded-md bg-background"
                  >
                    <option value="">All Ratings</option>
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>
                </div>

                {/* Reviews List */}
                {filteredReviews.length === 0 ? (
                  <div className="text-center py-8">
                    {totalReviews === 0 ? (
                      <>
                        <Star className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          No Reviews Yet
                        </h3>
                        <p className="text-muted-foreground">
                          This worker hasn't received any reviews yet.
                        </p>
                      </>
                    ) : (
                      <>
                        <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          No Reviews Found
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          Try adjusting your search or filter criteria
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSearchQuery("");
                            setFilterRating("");
                          }}
                        >
                          Clear Filters
                        </Button>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredReviews.map((review) => (
                      <div
                        key={review.id}
                        className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <UserAvatar
                              user={{ fullName: review.customerName }}
                              size="md"
                              fallback={review.customerName?.[0] || "C"}
                            />
                            <div>
                              <h4 className="font-semibold text-foreground">
                                {review.customerName}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {review.service}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            {renderStars(review.rating)}
                            <p className="text-xs text-muted-foreground mt-1">
                              {review.date}
                            </p>
                          </div>
                        </div>

                        <p className="text-foreground leading-relaxed mb-3">
                          "{review.comment}"
                        </p>

                        <div className="flex items-center justify-between pt-3 border-t text-sm text-muted-foreground">
                          <span>Job Value: ${review.jobValue}</span>
                          <span
                            className={cn(
                              "px-2 py-1 rounded-full text-xs font-medium",
                              getRatingColor(review.rating),
                            )}
                          >
                            {review.rating} Star{review.rating !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Rating Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Rating Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {ratingDistribution.map((item) => (
                    <div
                      key={item.rating}
                      className="flex items-center space-x-3"
                    >
                      <div className="flex items-center space-x-1 w-12">
                        <span className="text-sm font-medium">
                          {item.rating}
                        </span>
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      </div>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-muted-foreground w-12">
                        {item.count}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Insights */}
            <Card className="border-green-200 bg-green-50/50">
              <CardHeader>
                <CardTitle className="text-green-700 flex items-center">
                  <ThumbsUp className="w-5 h-5 mr-2" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-green-800">
                      Satisfaction Rate
                    </span>
                    <span className="text-sm font-semibold text-green-800">
                      {totalReviews > 0
                        ? Math.round(
                            (filteredReviews.filter((r) => r.rating >= 4)
                              .length /
                              totalReviews) *
                              100,
                          )
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-green-800">
                      Average Rating
                    </span>
                    <span className="text-sm font-semibold text-green-800">
                      {averageRating}/5.0
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-green-800">
                      Total Reviews
                    </span>
                    <span className="text-sm font-semibold text-green-800">
                      {totalReviews}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Phone className="w-4 h-4 mr-2" />
                  Contact Worker
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Briefcase className="w-4 h-4 mr-2" />
                  Hire for Job
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}