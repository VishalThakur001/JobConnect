import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  Star,
  Calendar,
  User,
  ArrowLeft,
  TrendingUp,
  BarChart3,
  Filter,
  Search,
  SortAsc,
  SortDesc,
  MessageSquare,
  Award,
  Target,
  ThumbsUp,
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
import { useWorkerReviews } from "../hooks/useReview";
import UserAvatar from "../components/UserAvatar";

export default function WorkerReviewsPage() {
  const { user } = useSelector((state) => state.user);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRating, setFilterRating] = useState("");
  const [sortBy, setSortBy] = useState("newest"); // newest, oldest, highest, lowest

  // Fetch worker reviews
  const {
    data: reviewsResponse,
    isLoading: reviewsLoading,
    error: reviewsError,
  } = useWorkerReviews();

  const reviews = reviewsResponse?.data || [];
  const stats = reviewsResponse?.stats || {};

  // Filter and sort reviews
  const filteredAndSortedReviews = reviews
    .filter((review) => {
      const matchesSearch =
        !searchQuery ||
        review.customer?.fullName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        review.comment?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.booking?.job?.title
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesRating =
        !filterRating || review.rating === parseInt(filterRating);

      return matchesSearch && matchesRating;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "highest":
          return b.rating - a.rating;
        case "lowest":
          return a.rating - b.rating;
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  // Calculate dynamic stats
  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? (
          reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
        ).toFixed(1)
      : "0.0";

  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((review) => review.rating === rating).length,
    percentage:
      totalReviews > 0
        ? Math.round(
            (reviews.filter((review) => review.rating === rating).length /
              totalReviews) *
              100,
          )
        : 0,
  }));

  const recentReviewsCount = reviews.filter((review) => {
    const reviewDate = new Date(review.createdAt);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return reviewDate >= thirtyDaysAgo;
  }).length;

  const renderStars = (rating, size = "sm") => {
    const starSize = size === "lg" ? "w-5 h-5" : "w-4 h-4";
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              starSize,
              star <= rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300",
            )}
          />
        ))}
      </div>
    );
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return "text-green-600 bg-green-50";
    if (rating >= 4) return "text-blue-600 bg-blue-50";
    if (rating >= 3) return "text-yellow-600 bg-yellow-50";
    if (rating >= 2) return "text-orange-600 bg-orange-50";
    return "text-red-600 bg-red-50";
  };

  if (reviewsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your reviews...</p>
          </div>
        </div>
      </div>
    );
  }

  if (reviewsError) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Failed to Load Reviews
            </h2>
            <p className="text-muted-foreground mb-4">
              There was an error loading your reviews
            </p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" size="sm" asChild>
              <Link to="/worker/home">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <UserAvatar user={user} size="2xl" />
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  My Reviews
                </h1>
                <p className="text-muted-foreground">
                  See what customers are saying about your services
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {totalReviews > 0 && (
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    {renderStars(parseFloat(averageRating), "lg")}
                    <span className="text-2xl font-bold text-foreground">
                      {averageRating}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Based on {totalReviews} reviews
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="card-gradient border-none shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Reviews
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {totalReviews}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-gradient border-none shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Average Rating
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {averageRating}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center">
                  <Star className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-gradient border-none shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Recent (30 days)
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {recentReviewsCount}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-gradient border-none shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    5-Star Reviews
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {ratingDistribution.find((r) => r.rating === 5)?.count || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {totalReviews === 0 ? (
          // Empty State
          <Card className="text-center py-16">
            <CardContent>
              <div className="max-w-md mx-auto">
                <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No Reviews Yet
                </h3>
                <p className="text-muted-foreground mb-6">
                  Complete some jobs to start receiving reviews from customers.
                  Great reviews help you get more bookings!
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild>
                    <Link to="/worker/find-jobs">
                      <Target className="w-4 h-4 mr-2" />
                      Find Jobs
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/worker/bookings">
                      <Calendar className="w-4 h-4 mr-2" />
                      View Bookings
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Reviews List */}
            <div className="lg:col-span-2 space-y-6">
              {/* Filters and Search */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Filter className="w-5 h-5 mr-2" />
                    Filter & Search Reviews
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <Input
                        placeholder="Search reviews, customers, or services..."
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
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-3 py-2 border rounded-md bg-background"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="highest">Highest Rating</option>
                      <option value="lowest">Lowest Rating</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              {/* Reviews List */}
              <div className="space-y-4">
                {filteredAndSortedReviews.map((review) => (
                  <Card
                    key={review._id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <UserAvatar
                            user={review.customer}
                            size="md"
                            fallback={review.customer?.fullName?.[0] || "C"}
                          />
                          <div>
                            <h4 className="font-semibold text-foreground">
                              {review.customer?.fullName || "Customer"}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {review.booking?.job?.title ||
                                review.booking?.job?.category ||
                                "Service"}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          {renderStars(review.rating)}
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {review.comment && (
                        <div className="mb-4">
                          <p className="text-foreground leading-relaxed">
                            "{review.comment}"
                          </p>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {review.booking?.scheduledDate
                              ? new Date(
                                  review.booking.scheduledDate,
                                ).toLocaleDateString()
                              : "Date not available"}
                          </span>
                          {review.booking?.totalAmount && (
                            <span>
                              Job Value: ${review.booking.totalAmount}
                            </span>
                          )}
                        </div>
                        <span
                          className={cn(
                            "text-xs px-2 py-1 rounded-full font-medium",
                            getRatingColor(review.rating),
                          )}
                        >
                          {review.rating} Star{review.rating !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {filteredAndSortedReviews.length === 0 &&
                  (searchQuery || filterRating) && (
                    <Card className="text-center py-12">
                      <CardContent>
                        <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          No Reviews Found
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          Try adjusting your search criteria or filters
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
                      </CardContent>
                    </Card>
                  )}
              </div>
            </div>

            {/* Sidebar - Rating Distribution & Stats */}
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
                    Performance Insights
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
                              (reviews.filter((r) => r.rating >= 4).length /
                                totalReviews) *
                                100,
                            )
                          : 0}
                        %
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-green-800">
                        Response Quality
                      </span>
                      <span className="text-sm font-semibold text-green-800">
                        {averageRating >= 4.5
                          ? "Excellent"
                          : averageRating >= 4
                            ? "Good"
                            : averageRating >= 3
                              ? "Fair"
                              : "Needs Improvement"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-green-800">
                        Recent Trend
                      </span>
                      <span className="text-sm font-semibold text-green-800">
                        {recentReviewsCount > 0 ? "Active" : "Low Activity"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" asChild>
                    <Link to="/worker/find-jobs">
                      <Target className="w-4 h-4 mr-2" />
                      Find More Jobs
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link to="/worker/bookings">
                      <Calendar className="w-4 h-4 mr-2" />
                      View Bookings
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link to="/worker/profile">
                      <User className="w-4 h-4 mr-2" />
                      Update Profile
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}