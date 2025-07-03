import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { useChangePassword } from "../../hooks/useProfile";

export default function SecuritySettings() {
  const changePasswordMutation = useChangePassword();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = watch("newPassword");

  const onSubmit = (data) => {
    if (data.newPassword !== data.confirmPassword) {
      return;
    }

    changePasswordMutation.mutate(
      {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      },
      {
        onSuccess: () => {
          reset();
        },
      },
    );
  };

  return (
    <div className="space-y-6">
      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <span className="mr-2">🔒</span>
            Change Password
          </CardTitle>
          <p className="text-sm text-gray-600">
            Update your password to keep your account secure.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password *</Label>
              <Input
                id="currentPassword"
                type="password"
                {...register("currentPassword", {
                  required: "Current password is required",
                })}
                className={errors.currentPassword ? "border-red-500" : ""}
                placeholder="Enter your current password"
              />
              {errors.currentPassword && (
                <p className="text-sm text-red-600">
                  {errors.currentPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password *</Label>
              <Input
                id="newPassword"
                type="password"
                {...register("newPassword", {
                  required: "New password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                    message:
                      "Password must contain at least one uppercase letter, one lowercase letter, and one number",
                  },
                })}
                className={errors.newPassword ? "border-red-500" : ""}
                placeholder="Enter your new password"
              />
              {errors.newPassword && (
                <p className="text-sm text-red-600">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password *</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword", {
                  required: "Please confirm your new password",
                  validate: (value) =>
                    value === newPassword || "Passwords do not match",
                })}
                className={errors.confirmPassword ? "border-red-500" : ""}
                placeholder="Confirm your new password"
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Password Requirements */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">
                Password Requirements:
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li
                  className={newPassword?.length >= 6 ? "text-green-600" : ""}
                >
                  • At least 6 characters long
                </li>
                <li
                  className={/[a-z]/.test(newPassword) ? "text-green-600" : ""}
                >
                  • Contains at least one lowercase letter
                </li>
                <li
                  className={/[A-Z]/.test(newPassword) ? "text-green-600" : ""}
                >
                  • Contains at least one uppercase letter
                </li>
                <li className={/\d/.test(newPassword) ? "text-green-600" : ""}>
                  • Contains at least one number
                </li>
              </ul>
            </div>

            <div className="flex justify-end pt-6 border-t">
              <Button
                type="submit"
                disabled={changePasswordMutation.isPending}
                className="px-8"
              >
                {changePasswordMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Changing...
                  </>
                ) : (
                  "Change Password"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Security Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <span className="mr-2">🛡️</span>
            Security Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-medium text-gray-900">
                  Use a Strong Password
                </h4>
                <p className="text-sm text-gray-600">
                  Create a unique password that includes a mix of letters,
                  numbers, and special characters.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-medium text-gray-900">
                  Don't Share Your Password
                </h4>
                <p className="text-sm text-gray-600">
                  Never share your password with anyone. ServiceHub staff will
                  never ask for your password.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-medium text-gray-900">Update Regularly</h4>
                <p className="text-sm text-gray-600">
                  Change your password regularly, especially if you suspect
                  unauthorized access.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
