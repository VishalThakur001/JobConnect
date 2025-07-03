import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, UserCheck, Briefcase, ArrowRight } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

export default function ChooseRolePage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has completed previous steps
    const phoneNumber = localStorage.getItem("registrationPhoneNumber");
    const token = localStorage.getItem("registrationToken");

    if (!phoneNumber || !token) {
      // If missing data, redirect to start
      navigate("/register/check-phone");
      return;
    }
  }, [navigate]);

  const handleRoleSelection = (role) => {
    // Store selected role
    localStorage.setItem("registrationRole", role);

    // Navigate to appropriate registration form
    if (role === "worker") {
      navigate("/register/worker");
    } else {
      navigate("/register/customer");
    }
  };

  const handleBackStep = () => {
    // Clear verification token and go back to OTP
    localStorage.removeItem("registrationToken");
    navigate("/register/verify-otp");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
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
              Choose Your Role
            </CardTitle>
            <CardDescription>
              How would you like to use ServiceHub?
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Customer Option */}
            <Button
              variant="outline"
              className="h-auto p-6 flex flex-col items-center space-y-3 hover:border-primary hover:bg-primary/5 transition-all group w-full"
              onClick={() => handleRoleSelection("customer")}
            >
              <UserCheck className="w-10 h-10 text-primary group-hover:scale-110 transition-transform" />
              <div className="text-center">
                <h3 className="font-semibold text-lg mb-1">I need services</h3>
                <p className="text-sm text-muted-foreground">
                  Find and book trusted professionals for your needs
                </p>
              </div>
              <div className="flex items-center text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-sm mr-1">Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Button>

            {/* Worker Option */}
            <Button
              variant="outline"
              className="h-auto p-6 flex flex-col items-center space-y-3 hover:border-primary hover:bg-primary/5 transition-all group w-full"
              onClick={() => handleRoleSelection("worker")}
            >
              <Briefcase className="w-10 h-10 text-primary group-hover:scale-110 transition-transform" />
              <div className="text-center">
                <h3 className="font-semibold text-lg mb-1">
                  I provide services
                </h3>
                <p className="text-sm text-muted-foreground">
                  Offer your skills and earn money by helping others
                </p>
              </div>
              <div className="flex items-center text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-sm mr-1">Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Button>

            {/* Help Text */}
            <div className="text-center pt-4">
              <p className="text-xs text-muted-foreground">
                Don't worry, you can always change this later in your profile
                settings
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-muted-foreground">New to ServiceHub?</p>
          <div className="flex justify-center space-x-4 text-xs">
            <button
              onClick={() => navigate("/how-it-works")}
              className="text-primary hover:underline"
            >
              How it Works
            </button>
            <button
              onClick={() => navigate("/about")}
              className="text-primary hover:underline"
            >
              About Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
