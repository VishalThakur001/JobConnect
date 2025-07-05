import { useState } from "react";
import { useSelector } from "react-redux";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { useUpdateProfilePhoto } from "../../hooks/useProfile";
import UserAvatar from "../../components/UserAvatar";

export default function PhotoUpload() {
  const { user } = useSelector((state) => state.user);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const updatePhotoMutation = useUpdateProfilePhoto();

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should be less than 5MB");
        return;
      }

      setSelectedFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("photo", selectedFile);

      updatePhotoMutation.mutate(formData, {
        onSuccess: () => {
          setPreviewUrl(null);
          setSelectedFile(null);
          // Reset file input
          const fileInput = document.getElementById("photo-upload");
          if (fileInput) fileInput.value = "";
        },
      });
    }
  };

  const cancelUpload = () => {
    setPreviewUrl(null);
    setSelectedFile(null);
    // Reset file input
    const fileInput = document.getElementById("photo-upload");
    if (fileInput) fileInput.value = "";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <span className="mr-2">📸</span>
          Profile Photo
        </CardTitle>
        <p className="text-sm text-gray-600">
          {user?.role === "worker"
            ? "A professional photo helps build trust with customers."
            : "Upload a profile photo to personalize your account."}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Photo */}
        <div className="flex items-center space-x-6">
          <div className="relative">
            <img
              src={previewUrl || user?.photo || "/default-avatar.png"}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 shadow-md"
            />
            {updatePhotoMutation.isPending && (
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900">
              {previewUrl ? "Preview" : "Current Photo"}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              JPG, PNG, or GIF. Maximum file size 5MB.
            </p>

            {!previewUrl ? (
              <div>
                <Label
                  htmlFor="photo-upload"
                  className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Choose New Photo
                </Label>
                <Input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="flex space-x-3">
                <Button
                  onClick={handleUpload}
                  disabled={updatePhotoMutation.isPending}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {updatePhotoMutation.isPending
                    ? "Uploading..."
                    : "Upload Photo"}
                </Button>
                <Button
                  onClick={cancelUpload}
                  variant="outline"
                  disabled={updatePhotoMutation.isPending}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Upload Guidelines */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Photo Guidelines:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Use a clear, well-lit photo where your face is visible</li>
            <li>• Avoid group photos or photos with filters</li>
            <li>• Professional appearance is recommended for workers</li>
            <li>• Square photos work best (1:1 aspect ratio)</li>
            <li>• File formats: JPG, PNG, or GIF</li>
            <li>• Maximum file size: 5MB</li>
          </ul>
        </div>

        {/* Photo Stats for Workers */}
        {user?.role === "worker" && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">
              📊 Profile Impact
            </h4>
            <p className="text-sm text-blue-800">
              Workers with professional photos receive{" "}
              <strong>3x more bookings</strong> than those without. A good
              profile photo builds trust and credibility with potential
              customers.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
