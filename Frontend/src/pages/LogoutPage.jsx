import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle, Home, LogIn, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { useLogout } from "../hooks/useAuth";

export default function LogoutPage() {
  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();
  const logoutMutation = useLogout();

  // Trigger logout API + Redux on page mount
  useEffect(() => {
    logoutMutation.mutate();
  }, []);

  // Handle countdown redirection
  useEffect(() => {
    if (logoutMutation.isSuccess) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate("/");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [logoutMutation.isSuccess, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg text-center">
          <CardHeader>
            {logoutMutation.isPending ? (
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-gray-100">
                <Loader2 className="w-8 h-8 text-gray-500 animate-spin" />
              </div>
            ) : (
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            )}

            <CardTitle className="text-2xl font-bold text-foreground">
              {logoutMutation.isPending
                ? "Logging Out..."
                : "Successfully Logged Out"}
            </CardTitle>

            <CardDescription>
              {logoutMutation.isPending
                ? "Please wait while we securely log you out."
                : "Thank you for using ServiceHub. We hope to see you again soon!"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {!logoutMutation.isPending && (
              <>
                <div className="p-4 bg-accent/50 rounded-lg border">
                  <p className="text-sm text-muted-foreground">
                    You will be redirected to the home page in{" "}
                    <span className="font-semibold text-primary">
                      {countdown}
                    </span>{" "}
                    seconds
                  </p>
                </div>

                <div className="space-y-3">
                  <Button asChild className="w-full">
                    <Link to="/">
                      <Home className="w-4 h-4 mr-2" />
                      Go to Home
                    </Link>
                  </Button>

                  <Button variant="outline" asChild className="w-full">
                    <Link to="/login">
                      <LogIn className="w-4 h-4 mr-2" />
                      Sign In Again
                    </Link>
                  </Button>
                </div>

                <div className="text-center pt-4">
                  <p className="text-xs text-muted-foreground">
                    Your session has been securely terminated.
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {!logoutMutation.isPending && (
          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Want to stay connected?
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                to="/about"
                className="text-sm text-primary hover:underline"
              >
                About Us
              </Link>
              <Link
                to="/how-it-works"
                className="text-sm text-primary hover:underline"
              >
                How It Works
              </Link>
              <Link
                to="/contact"
                className="text-sm text-primary hover:underline"
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
