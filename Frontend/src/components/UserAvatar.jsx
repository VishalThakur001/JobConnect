import { cn } from "../utils/cn";

const getAvatarColor = (name) => {
  if (!name) return "bg-gradient-to-br from-gray-400 to-gray-600";

  // Generate a consistent color based on the name
  const colors = [
    "bg-gradient-to-br from-blue-400 to-blue-600",
    "bg-gradient-to-br from-purple-400 to-purple-600",
    "bg-gradient-to-br from-green-400 to-green-600",
    "bg-gradient-to-br from-orange-400 to-orange-600",
    "bg-gradient-to-br from-red-400 to-red-600",
    "bg-gradient-to-br from-indigo-400 to-indigo-600",
    "bg-gradient-to-br from-pink-400 to-pink-600",
    "bg-gradient-to-br from-teal-400 to-teal-600",
    "bg-gradient-to-br from-cyan-400 to-cyan-600",
    "bg-gradient-to-br from-emerald-400 to-emerald-600",
    "bg-gradient-to-br from-amber-400 to-amber-600",
    "bg-gradient-to-br from-rose-400 to-rose-600",
  ];

  const charCode = name.charCodeAt(0) + (name.charCodeAt(name.length - 1) || 0);
  return colors[charCode % colors.length];
};

const getInitials = (name) => {
  if (!name) return "U";

  const nameParts = name.trim().split(" ");
  if (nameParts.length === 1) {
    return nameParts[0].charAt(0).toUpperCase();
  }

  return (
    nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)
  ).toUpperCase();
};

export default function UserAvatar({
  user,
  size = "md",
  showName = false,
  showRole = false,
  className = "",
}) {
  const sizeClasses = {
    xs: "w-6 h-6 text-xs",
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg",
    xl: "w-16 h-16 text-xl",
    "2xl": "w-20 h-20 text-2xl",
    "3xl": "w-24 h-24 text-3xl",
  };

  const textSizeClasses = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl",
  };

  const userName = user?.fullName || user?.name || "";
  const userRole = user?.role || "";
  const initials = getInitials(userName);
  const avatarColor = getAvatarColor(userName);

  return (
    <div className={cn("flex items-center space-x-3", className)}>
      {/* Avatar Circle */}
      <div
        className={cn(
          "rounded-full flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-white/20",
          sizeClasses[size],
          avatarColor,
        )}
      >
        {initials}
      </div>

      {/* User Info */}
      {(showName || showRole) && (
        <div className="flex flex-col">
          {showName && (
            <p
              className={cn(
                "font-semibold text-foreground",
                textSizeClasses[size],
              )}
            >
              {userName || "User"}
            </p>
          )}
          {showRole && (
            <p
              className={cn(
                "text-muted-foreground capitalize",
                size === "xs"
                  ? "text-xs"
                  : size === "sm"
                    ? "text-xs"
                    : size === "md"
                      ? "text-sm"
                      : size === "lg"
                        ? "text-sm"
                        : "text-base",
              )}
            >
              {userRole}
            </p>
          )}
        </div>
      )}
    </div>
  );
}