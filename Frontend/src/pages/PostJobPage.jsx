import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useCreateJob } from "../hooks/useJob";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { MapPin, DollarSign, Briefcase, FileText } from "lucide-react";
import toast from "react-hot-toast";

const serviceCategories = [
  { value: "plumber", label: "Plumber", icon: "🔧" },
  { value: "electrician", label: "Electrician", icon: "⚡" },
  { value: "carpenter", label: "Carpenter", icon: "🔨" },
  { value: "painter", label: "Painter", icon: "🎨" },
  { value: "mason", label: "Mason", icon: "🧱" },
  { value: "technician", label: "Technician", icon: "⚙️" },
  { value: "home-cleaner", label: "Home Cleaner", icon: "🏠" },
  { value: "mechanic", label: "Mechanic", icon: "🚗" },
];

export default function PostJobPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createJobMutation = useCreateJob();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      serviceCategory: "",
      budget: "",
      address: {
        street: "",
        city: "",
        state: "",
        pincode: "",
      },
    },
  });

  const selectedCategory = watch("serviceCategory");

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const result = await createJobMutation.mutateAsync({
        title: data.title,
        description: data.description,
        serviceCategory: data.serviceCategory,
        budget: parseFloat(data.budget),
        address: data.address,
      });

      if (result.success) {
        toast.success("Job posted successfully!");
        reset();
        navigate("/customer/jobs"); // Navigate to customer's job list
      } else {
        toast.error(result.message || "Failed to post job");
      }
    } catch (error) {
      toast.error("Failed to post job. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Post a Job</h1>
          <p className="text-muted-foreground mt-2">
            Describe your service needs and connect with skilled workers in your
            area
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Job Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Briefcase className="w-5 h-5 mr-2" />
                Job Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Job Title */}
              <div>
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Fix leaking kitchen faucet"
                  {...register("title", {
                    required: "Job title is required",
                    minLength: {
                      value: 5,
                      message: "Title must be at least 5 characters",
                    },
                  })}
                  className={errors.title ? "border-red-500" : ""}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Service Category */}
              <div>
                <Label htmlFor="serviceCategory">Service Category *</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                  {serviceCategories.map((category) => (
                    <label
                      key={category.value}
                      className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors hover:bg-accent/50 ${
                        selectedCategory === category.value
                          ? "border-primary bg-primary/10"
                          : "border-border"
                      }`}
                    >
                      <input
                        type="radio"
                        value={category.value}
                        {...register("serviceCategory", {
                          required: "Please select a service category",
                        })}
                        className="sr-only"
                      />
                      <span className="text-2xl mr-2">{category.icon}</span>
                      <span className="text-sm font-medium">
                        {category.label}
                      </span>
                    </label>
                  ))}
                </div>
                {errors.serviceCategory && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.serviceCategory.message}
                  </p>
                )}
              </div>

              {/* Budget */}
              <div>
                <Label htmlFor="budget">Budget (₹) *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="budget"
                    type="number"
                    placeholder="Enter your budget"
                    className={`pl-10 ${errors.budget ? "border-red-500" : ""}`}
                    {...register("budget", {
                      required: "Budget is required",
                      min: {
                        value: 50,
                        message: "Budget must be at least ₹50",
                      },
                      max: {
                        value: 100000,
                        message: "Budget cannot exceed ₹1,00,000",
                      },
                    })}
                  />
                </div>
                {errors.budget && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.budget.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Job Description */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="description">Describe the work needed</Label>
                <textarea
                  id="description"
                  rows={6}
                  placeholder="Provide detailed information about the work you need done. Include any specific requirements, materials needed, timeline, etc."
                  className={`w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                    errors.description ? "border-red-500" : ""
                  }`}
                  {...register("description", {
                    maxLength: {
                      value: 1000,
                      message: "Description cannot exceed 1000 characters",
                    },
                  })}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="street">Street Address *</Label>
                <Input
                  id="street"
                  placeholder="House/Building number, Street name"
                  {...register("address.street", {
                    required: "Street address is required",
                  })}
                  className={errors.address?.street ? "border-red-500" : ""}
                />
                {errors.address?.street && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.address.street.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    placeholder="City"
                    {...register("address.city", {
                      required: "City is required",
                    })}
                    className={errors.address?.city ? "border-red-500" : ""}
                  />
                  {errors.address?.city && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.address.city.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    placeholder="State"
                    {...register("address.state", {
                      required: "State is required",
                    })}
                    className={errors.address?.state ? "border-red-500" : ""}
                  />
                  {errors.address?.state && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.address.state.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="pincode">Pincode *</Label>
                  <Input
                    id="pincode"
                    placeholder="Pincode"
                    {...register("address.pincode", {
                      required: "Pincode is required",
                      pattern: {
                        value: /^\d{6}$/,
                        message: "Pincode must be 6 digits",
                      },
                    })}
                    className={errors.address?.pincode ? "border-red-500" : ""}
                  />
                  {errors.address?.pincode && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.address.pincode.message}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/customer")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || createJobMutation.isPending}
              className="min-w-[120px]"
            >
              {isSubmitting || createJobMutation.isPending
                ? "Posting..."
                : "Post Job"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}