import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Phone, Lock, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { useLogin } from "../hooks/useAuth";
import { validationRules, formatPhoneNumber } from "../utils/validation";
import { cn } from "../utils/cn";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      phoneNumber: "",
      password: "",
    },
  });

  const phoneNumber = watch("phoneNumber");

  const onSubmit = async (data) => {
    try {
      const formattedPhone = data.phoneNumber.replace(/\D/g, ""); // remove non-digit characters
      const phoneWithCountryCode = `91${formattedPhone}`; // add 91 prefix

      await loginMutation.mutateAsync({
        phoneNumber: phoneWithCountryCode,
        password: data.password,
      });
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setValue("phoneNumber", formatted);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
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
            <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to your ServiceHub account to continue
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                        "border-destructive focus-visible:ring-destructive"
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
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className={cn(
                      "pl-10 pr-10",
                      errors.password &&
                        "border-destructive focus-visible:ring-destructive"
                    )}
                    {...register("password", validationRules.password)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || loginMutation.isPending}
              >
                {isSubmitting || loginMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground/20 border-t-primary-foreground rounded-full animate-spin mr-2" />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>

              {/* Error Message */}
              {loginMutation.error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                  <p className="text-sm text-destructive text-center">
                    {loginMutation.error.message ||
                      "Login failed. Please try again."}
                  </p>
                </div>
              )}
            </form>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-primary font-medium hover:underline"
                >
                  Sign up here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            By signing in, you agree to our{" "}
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
