import { User } from "../models/user.model.js";
import { BlacklistRefreshToken } from "../models/blacklistedRefreshToken.model.js";
import { uploadCloudinary } from "../utils/cloudinary.js";
import { sendOtp } from "../utils/sendOtp.js";
import { createPhoneToken, verifyPhoneToken } from "../utils/phoneToken.js";
import jwt from "jsonwebtoken";

export const checkAvailability = async (req, res) => {
  const { phoneNumber } = req.body;

  const existingUser = await User.findOne({ phoneNumber });

  if (existingUser) {
    return res.status(409).json({ message: "Phone number already in use" });
  }

  return res.status(200).json({ message: "Available" });
};

export const sendOtpToPhone = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    await sendOtp(phoneNumber); // Twilio sends OTP to the phone number

    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Send OTP error:", error);
    return res.status(500).json({ message: "Failed to send OTP" });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    if (!phoneNumber || !otp) {
      return res.status(400).json({ message: "Phone and OTP are required" });
    }
    const verified = await sendOtp(phoneNumber, otp, true);

    if (!verified) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const token = createPhoneToken(phoneNumber);
    return res
      .status(200)
      .json({ token, message: "Phone number verified successfully" });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return res.status(500).json({ message: "Failed to verify OTP" });
  }
};

export const registerUser = async (req, res) => {
  try {
    const { phoneNumber, token } = req.body;

    if (!phoneNumber || !token) {
      return res
        .status(400)
        .json({ message: "Phone and Verification token are required" });
    }

    const decodedPhoneNumber = await verifyPhoneToken(token);

    if (decodedPhoneNumber !== phoneNumber) {
      return res
        .status(400)
        .json({ message: "Invalid or expired verification token" });
    }

    const { fullName, email, password, role, profession } = req.body;

    const address = req.body.address;
    const { street, city, state, pincode } = JSON.parse(
      JSON.stringify(address),
    );

    if (!street || !city || !state || !pincode) {
      return res.status(400).json({
        message: "All address fields are required",
      });
    }

    if (!role) {
      return res.status(400).json({ message: "Role is required" });
    }

    if (role === "worker") {
      if (!fullName || !email || !password || !profession) {
        return res
          .status(400)
          .json({ message: "All fields are required for worker" });
      }
    } else {
      if (!fullName || !email || !password) {
        return res
          .status(400)
          .json({ message: "All fields are required for customer" });
      }
    }

    const photoPath = req.file ? req.file.path : null;
    let photo = null;

    if (photoPath) {
      const result = await uploadCloudinary(photoPath);
      if (!result || !result.url) {
        return res
          .status(500)
          .json({ message: "Failed to upload photo to Cloudinary" });
      }
      photo = result.url;
    }

    if (role === "worker" && !photo) {
      return res
        .status(400)
        .json({ message: "Profile photo is required for worker" });
    }

    let availabilityTimes = req.body.availabilityTimes;
    if (role === "worker" && typeof availabilityTimes === "string") {
      try {
        availabilityTimes = JSON.parse(availabilityTimes);
      } catch (e) {
        return res.status(400).json({ message: "Invalid availability format" });
      }
    }

    const user = await User.create({
      fullName,
      email,
      password,
      role,
      phoneNumber,
      profession,
      photo,
      address,
      availabilityTimes,
      isAvailable: role === "worker" ? true : undefined,
    }).select("-password -refreshToken");

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    const userToSend = await User.findById(user._id).select("-password -refreshToken");

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      message: "Registration successful",
      user : userToSend,
      accessToken,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const user = await User.findOne({ phoneNumber });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await user.isPasswordCorrect(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Wrong Password" });
    }

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // set to true in production with HTTPS
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const userToSend = await User.findById(user._id).select("-password -refreshToken");

    res.status(200).json({
      message: "Login successful",
      user: userToSend,
      accessToken,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const logoutUser = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(400).json({ message: "No refresh token provided" });
    }

    const user = await User.findOne({ refreshToken });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await BlacklistRefreshToken.create({ refreshToken });

    user.refreshToken = null;
    await user.save({ validateBeforeSave: false });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
    });

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    const blacklisted = await BlacklistRefreshToken.findOne({ refreshToken });
    if (blacklisted) {
      return res.status(403).json({ message: "Token is blacklisted" });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newAccessToken = await user.generateAccessToken();

    res.status(200).json({
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(401).json({ message: "Invalid or expired refresh token" });
  }
};