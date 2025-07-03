export const validationRules = {
  phoneNumber: {
    required: "Phone number is required",
    pattern: {
      value: /^[+]?[\d\s\-()]{10,}$/,
      message: "Please enter a valid phone number",
    },
  },
  password: {
    required: "Password is required",
    minLength: {
      value: 6,
      message: "Password must be at least 6 characters",
    },
  },
  confirmPassword: (password) => ({
    required: "Please confirm your password",
    validate: (value) => value === password || "Passwords do not match",
  }),
  name: {
    required: "Name is required",
    minLength: {
      value: 2,
      message: "Name must be at least 2 characters",
    },
  },
  fullName: {
    required: "Full name is required",
    minLength: {
      value: 2,
      message: "Full name must be at least 2 characters",
    },
  },
  email: {
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Please enter a valid email address",
    },
  },
  emailRequired: {
    required: "Email address is required",
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Please enter a valid email address",
    },
  },
  otp: {
    required: "OTP is required",
    pattern: {
      value: /^\d{6}$/,
      message: "OTP must be 6 digits",
    },
  },
};

export const formatPhoneNumber = (value) => {
  if (!value) return value;

  // Remove all non-digit characters
  const phoneNumber = value.replace(/[^\d]/g, "");

  // Format as needed (simple format for now)
  if (phoneNumber.length >= 10) {
    return phoneNumber.slice(0, 10);
  }

  return phoneNumber;
};
