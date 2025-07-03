    import { useState, useEffect } from "react";
    import { useForm } from "react-hook-form";
    import { useNavigate } from "react-router-dom";
    import { ArrowLeft, CheckCircle, Send } from "lucide-react";
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
    import { useVerifyOtp, useSendOtp } from "../../hooks/useAuth";
    import { validationRules } from "../../utils/validation";
    import { cn } from "../../utils/cn";

    export default function VerifyOTPPage() {
    const [phoneNumber, setPhoneNumber] = useState("");
    const navigate = useNavigate();
    const verifyOtpMutation = useVerifyOtp();
    const sendOtpMutation = useSendOtp();

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm({
        defaultValues: {
        otp: "",
        },
    });

    useEffect(() => {
        // Get phone number from localStorage
        const storedPhoneNumber = localStorage.getItem("registrationPhoneNumber");
        if (!storedPhoneNumber) {
        // If no phone number stored, redirect back to start
        navigate("/register/check-phone");
        return;
        }
        setPhoneNumber(storedPhoneNumber);
    }, [navigate]);

    const onSubmit = async (data) => {
        try {
        const result = await verifyOtpMutation.mutateAsync({
            phoneNumber: `+91${phoneNumber}`,
            otp: data.otp,
        });

        if (result.success && result.data?.token) {
            // Store verification token for registration
            localStorage.setItem("registrationToken", result.data.token);
            navigate("/register/choose-role");
        }
        } catch (error) {
        console.error("OTP verification error:", error);
        }
    };

    const handleResendOtp = async () => {
        try {
        await sendOtpMutation.mutateAsync(phoneNumber);
        } catch (error) {
        console.error("Resend OTP error:", error);
        }
    };

    const handleBackStep = () => {
        // Clear stored data and go back
        localStorage.removeItem("registrationPhoneNumber");
        navigate("/register/check-phone");
    };

    const isLoading = verifyOtpMutation.isPending;

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
                Verify Your Phone
                </CardTitle>
                <CardDescription>
                Enter the 6-digit code sent to {phoneNumber}
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* OTP Input */}
                <div className="space-y-2">
                    <Label htmlFor="otp" className="text-center block">
                    Verification Code
                    </Label>
                    <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    className={cn(
                        "text-center text-lg tracking-widest",
                        errors.otp &&
                        "border-destructive focus-visible:ring-destructive",
                    )}
                    {...register("otp", validationRules.otp)}
                    />
                    {errors.otp && (
                    <p className="text-sm text-destructive text-center">
                        {errors.otp.message}
                    </p>
                    )}
                </div>

                {/* Resend OTP */}
                <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">
                    Didn't receive the code?
                    </p>
                    <Button
                    type="button"
                    variant="ghost"
                    onClick={handleResendOtp}
                    disabled={sendOtpMutation.isPending}
                    className="text-primary"
                    >
                    {sendOtpMutation.isPending ? "Sending..." : "Resend Code"}
                    </Button>
                </div>

                {/* Verify Button */}
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                    <>
                        <div className="w-4 h-4 border-2 border-primary-foreground/20 border-t-primary-foreground rounded-full animate-spin mr-2" />
                        Verifying...
                    </>
                    ) : (
                    <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Verify Code
                    </>
                    )}
                </Button>

                {/* Error Messages */}
                {(verifyOtpMutation.error || sendOtpMutation.error) && (
                    <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                    <p className="text-sm text-destructive text-center">
                        {verifyOtpMutation.error?.message ||
                        sendOtpMutation.error?.message ||
                        "Something went wrong. Please try again."}
                    </p>
                    </div>
                )}

                {/* Success Message for Resend */}
                {sendOtpMutation.isSuccess && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                    <div className="flex items-center justify-center">
                        <Send className="w-4 h-4 text-green-600 mr-2" />
                        <p className="text-sm text-green-800">
                        New verification code sent!
                        </p>
                    </div>
                    </div>
                )}
                </form>
            </CardContent>
            </Card>

            {/* Help Text */}
            <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
                Having trouble? Check your spam folder or{" "}
                <button
                onClick={handleResendOtp}
                className="text-primary hover:underline"
                disabled={sendOtpMutation.isPending}
                >
                request a new code
                </button>
            </p>
            </div>
        </div>
        </div>
    );
    }
