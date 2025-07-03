import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
} from "lucide-react";
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
import { useRegister } from "../../hooks/useAuth";
import { validationRules } from "../../utils/validation";
import { cn } from "../../utils/cn";

export default function RegisterCustomerPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationToken, setVerificationToken] = useState("");

  const navigate = useNavigate();
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      street: "",
      city: "",
      state: "",
      pincode: "",
    },
  });

  const password = watch("password");

  useEffect(() => {
    // Check if user has completed previous steps
    const storedPhoneNumber = localStorage.getItem("registrationPhoneNumber");
    const storedToken = localStorage.getItem("registrationToken");
    const storedRole = localStorage.getItem("registrationRole");

    if (!storedPhoneNumber || !storedToken || storedRole !== "customer") {
      navigate("/register/check-phone");
      return;
    }

    setPhoneNumber(storedPhoneNumber);
    setVerificationToken(storedToken);
  }, [navigate]);

  const onSubmit = async (data) => {
    try {
      const address = {
        street: data.street,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
      };

      const userData = {
        phoneNumber : `+91${phoneNumber}`,
        token: verificationToken,
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        role: "customer",
        address,
      };

      await registerMutation.mutateAsync({
        userData,
        photo: null,
      });

      navigate("/customer/home");

      // Clear registration data from localStorage
      localStorage.removeItem("registrationPhoneNumber");
      localStorage.removeItem("registrationToken");
      localStorage.removeItem("registrationRole");
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  const handleBackStep = () => {
    navigate("/register/choose-role");
  };

  const isLoading = registerMutation.isPending;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={handleBackStep}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-primary-foreground font-bold text-lg">
                SH
              </span>
            </div>
            <CardTitle className="text-2xl font-bold">
              Create Your Account
            </CardTitle>
            <CardDescription>
              Complete your profile to start booking services on ServiceHub
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Personal Information</h3>

                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="fullName"
                      placeholder="Enter your full name"
                      className={cn(
                        "pl-10",
                        errors.fullName && "border-destructive",
                      )}
                      {...register("fullName", validationRules.fullName)}
                    />
                  </div>
                  {errors.fullName && (
                    <p className="text-sm text-destructive">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      className={cn(
                        "pl-10",
                        errors.email && "border-destructive",
                      )}
                      {...register("email", validationRules.emailRequired)}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-destructive">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Password Fields */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Security</h3>

                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a secure password"
                      className={cn(
                        "pl-10 pr-10",
                        errors.password && "border-destructive",
                      )}
                      {...register("password", validationRules.password)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
                      onClick={() => setShowPassword(!showPassword)}
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

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      className={cn(
                        "pl-10 pr-10",
                        errors.confirmPassword && "border-destructive",
                      )}
                      {...register(
                        "confirmPassword",
                        validationRules.confirmPassword(password),
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-destructive">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Address Information</h3>

                <div className="space-y-2">
                  <Label htmlFor="street">Street Address *</Label>
                  <Input
                    id="street"
                    placeholder="Enter your street address"
                    {...register("street", {
                      required: "Street address is required",
                    })}
                  />
                  {errors.street && (
                    <p className="text-sm text-destructive">
                      {errors.street.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      placeholder="City"
                      {...register("city", { required: "City is required" })}
                    />
                    {errors.city && (
                      <p className="text-sm text-destructive">
                        {errors.city.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      placeholder="State"
                      {...register("state", { required: "State is required" })}
                    />
                    {errors.state && (
                      <p className="text-sm text-destructive">
                        {errors.state.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pincode">PIN Code *</Label>
                  <Input
                    id="pincode"
                    placeholder="Enter PIN code"
                    {...register("pincode", {
                      required: "PIN code is required",
                    })}
                  />
                  {errors.pincode && (
                    <p className="text-sm text-destructive">
                      {errors.pincode.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground/20 border-t-primary-foreground rounded-full animate-spin mr-2" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Create Account
                  </>
                )}
              </Button>

              {/* Error Messages */}
              {registerMutation.error && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md space-y-3">
                  <p className="text-sm text-destructive text-center">
                    {registerMutation.error?.message ===
                    "Invalid or expired verification token"
                      ? "Your verification session has expired or is invalid. Please start the registration again."
                      : registerMutation.error?.message ||
                        "Registration failed. Please try again."}
                  </p>

                  {registerMutation.error?.message ===
                    "Invalid or expired verification token" && (
                    <div className="text-center">
                      <Button
                        variant="outline"
                        onClick={() => {
                          localStorage.removeItem("registrationPhoneNumber");
                          localStorage.removeItem("registrationToken");
                          localStorage.removeItem("registrationRole");
                          navigate("/register/check-phone");
                        }}
                      >
                        Start Over
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Welcome Message */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            🎉 Almost done! You'll be able to start booking services right after
            registration.
          </p>
        </div>
      </div>
    </div>
  );
}
