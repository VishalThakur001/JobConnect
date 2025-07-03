import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Phone, ArrowLeft, Send, CheckCircle } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { useCheckAvailability, useSendOtp } from "../../hooks/useAuth";
import { validationRules, formatPhoneNumber } from "../../utils/validation";
import { cn } from "../../utils/cn";

export default function CheckPhoneAvailabilityPage() {
  const navigate = useNavigate();
  const checkAvailabilityMutation = useCheckAvailability();
  const sendOtpMutation = useSendOtp();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      phoneNumber: "",
    },
  });

  const phoneNumber = watch("phoneNumber");

  const onSubmit = async (data) => {
    try {
      // First check if phone number is available
      const availabilityResult = await checkAvailabilityMutation.mutateAsync(
        `+91${data.phoneNumber}`,
      );

      if (availabilityResult.success) {
        // Phone is available, send OTP
        const otpResult = await sendOtpMutation.mutateAsync(`+91${data.phoneNumber}`);

        if (otpResult.success) {
          // Store phone number in localStorage for next step
          localStorage.setItem("registrationPhoneNumber", data.phoneNumber);
          navigate("/register/verify-otp");
        }
      }
    } catch (error) {
      console.error("Phone check error:", error);
    }
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setValue("phoneNumber", formatted);
  };

  const isLoading =
    checkAvailabilityMutation.isPending || sendOtpMutation.isPending;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-primary-foreground font-bold text-lg">
                SH
              </span>
            </div>
            <CardTitle className="text-2xl font-bold">Get Started</CardTitle>
            <CardDescription>
              Enter your phone number to check availability and create your
              account
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Phone Number Field */}
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="Enter your phone number"
                    className={cn(
                      "pl-10",
                      errors.phoneNumber &&
                        "border-destructive focus-visible:ring-destructive",
                    )}
                    {...register("phoneNumber", validationRules.phoneNumber)}
                    onChange={handlePhoneChange}
                    value={phoneNumber}
                  />
                </div>
                {errors.phoneNumber && (
                  <p className="text-sm text-destructive">
                    {errors.phoneNumber.message}
                  </p>
                )}

                <div className="text-xs text-muted-foreground">
                  <p>
                    We'll send you a verification code to confirm your number
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground/20 border-t-primary-foreground rounded-full animate-spin mr-2" />
                    {checkAvailabilityMutation.isPending
                      ? "Checking..."
                      : "Sending OTP..."}
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Continue
                  </>
                )}
              </Button>

              {/* Success/Error Messages */}
              {checkAvailabilityMutation.isSuccess && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    <p className="text-sm text-green-800">
                      Phone number is available! Sending verification code...
                    </p>
                  </div>
                </div>
              )}

              {(checkAvailabilityMutation.error || sendOtpMutation.error) && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                  <p className="text-sm text-destructive text-center">
                    {checkAvailabilityMutation.error?.message ||
                      sendOtpMutation.error?.message ||
                      "Something went wrong. Please try again."}
                  </p>
                </div>
              )}
            </form>

            {/* Sign In Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-primary font-medium hover:underline"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Terms and Privacy */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            By continuing, you agree to our{" "}
            <Link to="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

