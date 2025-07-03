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

export default function AddressForm() {
  const { user } = useSelector((state) => state.user);
  const updateProfileMutation = useUpdateProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      street: "",
      city: "",
      state: "",
      pincode: "",
    },
  });

  // Initialize form with user data
  useEffect(() => {
    if (user?.address) {
      reset({
        street: user.address.street || "",
        city: user.address.city || "",
        state: user.address.state || "",
        pincode: user.address.pincode || "",
      });
    }
  }, [user, reset]);

  const onSubmit = (data) => {
    // Create address object exactly as backend expects
    const addressData = {
      address: {
        street: data.street,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
      },
    };

    updateProfileMutation.mutate(addressData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <span className="mr-2">🏠</span>
          Address Information
        </CardTitle>
        <p className="text-sm text-gray-600">
          Update your address details for better service delivery.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="street">Street Address *</Label>
            <Input
              id="street"
              {...register("street", {
                required: "Street address is required",
                minLength: {
                  value: 5,
                  message: "Street address must be at least 5 characters",
                },
              })}
              className={errors.street ? "border-red-500" : ""}
              placeholder="Enter your street address"
            />
            {errors.street && (
              <p className="text-sm text-red-600">{errors.street.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                {...register("city", {
                  required: "City is required",
                  minLength: {
                    value: 2,
                    message: "City must be at least 2 characters",
                  },
                })}
                className={errors.city ? "border-red-500" : ""}
                placeholder="Enter your city"
              />
              {errors.city && (
                <p className="text-sm text-red-600">{errors.city.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                {...register("state", {
                  required: "State is required",
                  minLength: {
                    value: 2,
                    message: "State must be at least 2 characters",
                  },
                })}
                className={errors.state ? "border-red-500" : ""}
                placeholder="Enter your state"
              />
              {errors.state && (
                <p className="text-sm text-red-600">{errors.state.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pincode">Pincode *</Label>
            <Input
              id="pincode"
              {...register("pincode", {
                required: "Pincode is required",
                pattern: {
                  value: /^[0-9]{6}$/,
                  message: "Pincode must be exactly 6 digits",
                },
              })}
              className={errors.pincode ? "border-red-500" : ""}
              placeholder="Enter 6-digit pincode"
              maxLength={6}
            />
            {errors.pincode && (
              <p className="text-sm text-red-600">{errors.pincode.message}</p>
            )}
          </div>

          {/* Current Address Display */}
          {user?.address && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">
                Current Address:
              </h4>
              <p className="text-sm text-gray-700">
                {user.address.street}, {user.address.city}, {user.address.state}{" "}
                - {user.address.pincode}
              </p>
            </div>
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
                "Update Address"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
