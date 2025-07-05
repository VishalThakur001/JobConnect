import { useState } from "react";
import { useSelector } from "react-redux";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import PersonalInfoForm from "./Profile/PersonalInfoForm";
import AddressForm from "./Profile/AddressForm";
import WorkerSettingsForm from "./Profile/WorkerSettingsForm";
import PhotoUpload from "./Profile/PhotoUpload";
import SecuritySettings from "./Profile/SecuritySettings";
import UserAvatar from "../components/UserAvatar";

export default function ProfilePage() {
  const { user } = useSelector((state) => state.user);
  const [activeSection, setActiveSection] = useState("personal");

  const menuItems = [
    { id: "personal", label: "Personal Info", icon: "👤" },
    { id: "photo", label: "Profile Photo", icon: "📸" },
    { id: "address", label: "Address", icon: "🏠" },
    ...(user?.role === "worker"
      ? [{ id: "work", label: "Work Settings", icon: "���" }]
      : []),
    { id: "security", label: "Security", icon: "🔒" },
  ];

  const renderActiveSection = () => {
    switch (activeSection) {
      case "personal":
        return <PersonalInfoForm />;
      case "photo":
        return <PhotoUpload />;
      case "address":
        return <AddressForm />;
      case "work":
        return user?.role === "worker" ? <WorkerSettingsForm /> : null;
      case "security":
        return <SecuritySettings />;
      default:
        return <PersonalInfoForm />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="mt-2 text-gray-600">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Settings</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors rounded-none ${
                        activeSection === item.id
                          ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <span className="mr-3">{item.icon}</span>
                      {item.label}
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>

            {/* User Info Card */}
            <Card className="mt-6">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4">
                  <img
                    src={user?.photo || "/default-avatar.png"}
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {user?.fullName}
                    </h3>
                    <p className="text-sm text-gray-500 capitalize">
                      {user?.role}
                      {user?.profession && ` • ${user.profession}`}
                    </p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">{renderActiveSection()}</div>
        </div>
      </div>
    </div>
  );
}
