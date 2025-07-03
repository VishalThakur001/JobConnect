import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { useUpdateProfile } from "../../hooks/useProfile";

const PROFESSIONS = [
  "Plumber",
  "Electrician",
  "Carpenter",
  "Painter",
  "Mason",
  "Technician",
  "Home Cleaner",
  "Mechanic",
];

export default function PersonalInfoForm() {
  const { user } = useSelector((state) => state.user);
  const updateProfileMutation = useUpdateProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      profession: "",
      experienceYears: 1,
      bookingsAday: 5,
    },
  });

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      reset({
        fullName: user.fullName || "",
        email: user.email || "",
        profession: user.profession || "",
        experienceYears: user.experienceYears || 1,
        bookingsAday: user.bookingsAday || 5,
      });
    }
  }, [user, reset]);

  const onSubmit = (data) => {
    // Only send non-empty fields (excluding role and phoneNumber as requested)
    const updateData = {};

    if (data.fullName && data.fullName !== user?.fullName) {
      updateData.fullName = data.fullName;
    }

    if (data.email && data.email !== user?.email) {
      updateData.email = data.email;
    }

    // Worker-specific fields
    if (user?.role === "worker") {
      if (data.profession && data.profession !== user?.profession) {
        updateData.profession = data.profession;
      }

      if (
        data.experienceYears &&
        data.experienceYears !== user?.experienceYears
      ) {
        updateData.experienceYears = parseInt(data.experienceYears);
      }

      if (data.bookingsAday && data.bookingsAday !== user?.bookingsAday) {
        updateData.bookingsAday = parseInt(data.bookingsAday);
      }
    }

    if (Object.keys(updateData).length > 0) {
      updateProfileMutation.mutate(updateData);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <span className="mr-2">👤</span>
          Personal Information
        </CardTitle>
        <p className="text-sm text-gray-600">
          Update your basic information. Phone number and role cannot be
          changed.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                {...register("fullName", {
                  required: "Full name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                })}
                className={errors.fullName ? "border-red-500" : ""}
                placeholder="Enter your full name"
              />
              {errors.fullName && (
                <p className="text-sm text-red-600">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                className={errors.email ? "border-red-500" : ""}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
          </div>

          {/* Read-only fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input
                value={user?.phoneNumber || ""}
                disabled
                className="bg-gray-100 text-gray-500"
                placeholder="Phone number"
              />
              <p className="text-xs text-gray-500">
                Phone number cannot be changed
              </p>
            </div>

            <div className="space-y-2">
              <Label>Role</Label>
              <Input
                value={user?.role || ""}
                disabled
                className="bg-gray-100 text-gray-500 capitalize"
                placeholder="User role"
              />
              <p className="text-xs text-gray-500">Role cannot be changed</p>
            </div>
          </div>

          {/* Worker-specific fields */}
          {user?.role === "worker" && (
            <>
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Professional Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="profession">Profession *</Label>
                    <select
                      id="profession"
                      {...register("profession", {
                        required: "Profession is required for workers",
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select your profession</option>
                      {PROFESSIONS.map((prof) => (
                        <option key={prof} value={prof}>
                          {prof}
                        </option>
                      ))}
                    </select>
                    {errors.profession && (
                      <p className="text-sm text-red-600">
                        {errors.profession.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experienceYears">Years of Experience</Label>
                    <Input
                      id="experienceYears"
                      type="number"
                      min="1"
                      max="50"
                      {...register("experienceYears", {
                        required: "Experience is required",
                        min: { value: 1, message: "Minimum 1 year required" },
                        max: { value: 50, message: "Maximum 50 years allowed" },
                      })}
                      className={errors.experienceYears ? "border-red-500" : ""}
                      placeholder="Years of experience"
                    />
                    {errors.experienceYears && (
                      <p className="text-sm text-red-600">
                        {errors.experienceYears.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <div className="space-y-2">
                    <Label htmlFor="bookingsAday">
                      Maximum Bookings Per Day
                    </Label>
                    <Input
                      id="bookingsAday"
                      type="number"
                      min="1"
                      max="20"
                      {...register("bookingsAday", {
                        required: "Bookings per day is required",
                        min: { value: 1, message: "Minimum 1 booking per day" },
                        max: {
                          value: 20,
                          message: "Maximum 20 bookings per day",
                        },
                      })}
                      className={errors.bookingsAday ? "border-red-500" : ""}
                      placeholder="Maximum bookings per day"
                    />
                    {errors.bookingsAday && (
                      <p className="text-sm text-red-600">
                        {errors.bookingsAday.message}
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      Set how many bookings you can handle per day
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Submit Button */}
          <div className="flex justify-end pt-6 border-t">
            <Button
              type="submit"
              disabled={updateProfileMutation.isPending || !isDirty}
              className="px-8"
            >
              {updateProfileMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Updating...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
    