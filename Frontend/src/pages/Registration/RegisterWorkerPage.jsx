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
  Camera,
  Clock,
  CheckCircle,
  Plus,
  Trash2,
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

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function RegisterWorkerPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationToken, setVerificationToken] = useState("");

  const navigate = useNavigate();
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
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
      profession: "",
      experienceYears: 1,
      availabilityTimes: [],
    },
  });

  const password = watch("password");
  const availabilityTimes = watch("availabilityTimes") || [];

  useEffect(() => {
    // Check if user has completed previous steps
    const storedPhoneNumber = localStorage.getItem("registrationPhoneNumber");
    const storedToken = localStorage.getItem("registrationToken");
    const storedRole = localStorage.getItem("registrationRole");

    if (!storedPhoneNumber || !storedToken || storedRole !== "worker") {
      navigate("/register/check-phone");
      return;
    }

    setPhoneNumber(storedPhoneNumber);
    setVerificationToken(storedToken);
  }, [navigate]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddAvailability = () => {
    setValue("availabilityTimes", [
      ...availabilityTimes,
      { day: "Monday", startTime: "09:00", endTime: "17:00" },
    ]);
  };

  const handleRemoveAvailability = (index) => {
    setValue(
      "availabilityTimes",
      availabilityTimes.filter((_, i) => i !== index),
    );
  };

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
        role: "worker",
        profession: data.profession,
        experienceYears: data.experienceYears,
        availabilityTimes: data.availabilityTimes,
        address,
      };

      await registerMutation.mutateAsync({
        userData,
        photo: photoFile,
      });

      navigate("/worker/home");

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
      <div className="w-full max-w-2xl">
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
              Create Your Worker Profile
            </CardTitle>
            <CardDescription>
              Complete your profile to start offering services on ServiceHub
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Profile Photo */}
              <div className="space-y-3">
                <Label>Profile Photo *</Label>
                <div className="flex items-center space-x-4">
                  <div className="w-24 h-24 rounded-lg border-2 border-dashed border-border flex items-center justify-center overflow-hidden bg-muted">
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Camera className="w-8 h-8 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Upload a clear, professional photo of yourself
                    </p>
                  </div>
                </div>
                {!photoFile && (
                  <p className="text-sm text-destructive">
                    Profile photo is required for workers
                  </p>
                )}
              </div>

              {/* Basic Information */}
              <div className="grid md:grid-cols-2 gap-4">
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
                      placeholder="Enter your email"
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
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create password"
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
                      placeholder="Confirm password"
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

              {/* Professional Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="profession">Profession *</Label>
                  <select
                    id="profession"
                    className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                    {...register("profession", {
                      required: "Profession is required",
                    })}
                  >
                    <option value="">Select your profession</option>
                    {PROFESSIONS.map((prof) => (
                      <option key={prof} value={prof}>
                        {prof}
                      </option>
                    ))}
                  </select>
                  {errors.profession && (
                    <p className="text-sm text-destructive">
                      {errors.profession.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experienceYears">Experience (Years)</Label>
                  <Input
                    id="experienceYears"
                    type="number"
                    min="1"
                    max="50"
                    placeholder="Years of experience"
                    {...register("experienceYears", { min: 1, max: 50 })}
                  />
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Address Information</h3>

                <div className="space-y-2">
                  <Label htmlFor="street">Street Address *</Label>
                  <Input
                    id="street"
                    placeholder="Enter street address"
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

                <div className="grid md:grid-cols-3 gap-4">
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

                  <div className="space-y-2">
                    <Label htmlFor="pincode">PIN Code *</Label>
                    <Input
                      id="pincode"
                      placeholder="PIN Code"
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
              </div>

              {/* Availability Schedule */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-lg font-semibold">
                    Availability Schedule
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddAvailability}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Slot
                  </Button>
                </div>

                {availabilityTimes.length > 0 ? (
                  <div className="space-y-3">
                    {availabilityTimes.map((slot, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-4 gap-3 items-center p-3 border rounded-md bg-muted/30"
                      >
                        <select
                          className="h-9 rounded border text-sm bg-background"
                          {...register(`availabilityTimes.${index}.day`)}
                        >
                          {DAYS.map((day) => (
                            <option key={day} value={day}>
                              {day}
                            </option>
                          ))}
                        </select>
                        <Input
                          type="time"
                          className="h-9 text-sm"
                          {...register(`availabilityTimes.${index}.startTime`)}
                        />
                        <Input
                          type="time"
                          className="h-9 text-sm"
                          {...register(`availabilityTimes.${index}.endTime`)}
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveAvailability(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-8 border border-dashed rounded-md bg-muted/20">
                    <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground mb-2">
                      No availability slots added yet
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Click "Add Slot" to set your working hours
                    </p>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !photoFile}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground/20 border-t-primary-foreground rounded-full animate-spin mr-2" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Create Worker Account
                  </>
                )}
              </Button>

              {/* Error Messages */}
              {registerMutation.error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                  <p className="text-sm text-destructive text-center">
                    {registerMutation.error?.message ||
                      "Registration failed. Please try again."}
                  </p>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
