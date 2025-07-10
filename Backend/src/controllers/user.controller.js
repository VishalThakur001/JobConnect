import { User } from "../models/user.model.js";
import { Review } from "../models/review.model.js";
import { BlacklistRefreshToken } from "../models/blacklistedRefreshToken.model.js";
import { uploadCloudinary, deleteCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

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

export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Both current and new passwords are required" });
    }

    const user = await User.findById(userId).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const updateAccountDetails = async (req, res) => {
  try {
    const userId = req.user._id;
    const role = req.user.role;
    const { fullName, email, profession } = req.body;

    let updatedFields = {};

    // Add personal fields if present
    if (fullName) updatedFields.fullName = fullName;
    if (email) updatedFields.email = email;
    if (profession) updatedFields.profession = profession;

    // Handle address only if provided
    if (req.body.address) {
      const { street, city, state, pincode } = req.body.address;

      if (!street || !city || !state || !pincode) {
        return res.status(400).json({
          message: "All address fields are required",
        });
      }

      updatedFields.address = { street, city, state, pincode };
    }

    // Handle worker-specific fields only if user is a worker
    if (role === "worker") {
      // Handle availabilityTimes
      if (req.body.availabilityTimes) {
        let availabilityTimes = req.body.availabilityTimes;

        if (typeof availabilityTimes === "string") {
          try {
            availabilityTimes = JSON.parse(availabilityTimes);
          } catch (e) {
            return res
              .status(400)
              .json({ message: "Invalid availability format" });
          }
        }

        updatedFields.availabilityTimes = availabilityTimes;
      }

      // Handle isAvailable boolean field
      if (typeof req.body.isAvailable === "boolean") {
        updatedFields.isAvailable = req.body.isAvailable;
      }

      // Handle experienceYears
      if (req.body.experienceYears !== undefined) {
        const experienceYears = parseInt(req.body.experienceYears);
        if (!isNaN(experienceYears) && experienceYears >= 0) {
          updatedFields.experienceYears = experienceYears;
        }
      }

      // Handle bookingsAday
      if (req.body.bookingsAday !== undefined) {
        const bookingsAday = parseInt(req.body.bookingsAday);
        if (!isNaN(bookingsAday) && bookingsAday >= 0) {
          updatedFields.bookingsAday = bookingsAday;
        }
      }
    }

    // No fields to update
    if (Object.keys(updatedFields).length === 0) {
      return res
        .status(400)
        .json({ message: "No valid fields provided for update" });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updatedFields, {
      new: true,
      runValidators: true,
    }).select("-password -refreshToken");

    res
      .status(200)
      .json({ message: "Account updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Update account error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const userId = req.user._id;
    const { isAvailable } = req.body;

    const updatedUser = await User.findByIdAndUpdate(userId, { isAvailable }, {
      new: true,
      runValidators: true,
    }).select("-password -refreshToken");

    res
      .status(200)
      .json({ message: "Status updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Update status error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const updateProfilePhoto = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(404).json({ message: "User not found" });
    }

    const imagePath = req.file?.path;

    if (!imagePath) {
      return res.status(400).json({ message: "Profile photo is required" });
    }

    // Upload new image to Cloudinary
    const image = await uploadCloudinary(imagePath);

    if (!image.url) {
      return res
        .status(400)
        .json({ message: "Failed to upload profile photo" });
    }

    // Get the current user to access the old photo URL
    const currentUser = await User.findById(userId);

    // Delete old photo from Cloudinary if it exists
    if (currentUser?.photo) {
      try {
        await deleteCloudinary(currentUser.photo);
      } catch (error) {
        console.warn("Error deleting old profile photo:", error.message);
      }
    }

    // Update user with new photo URL
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { photo: image.url } },
      { new: true },
    ).select("-password -refreshToken");

    res.status(200).json({
      message: "Profile photo updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update profile photo error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "-password -refreshToken",
    );
    if (!user) return res.status(404).json({ message: "User not found" });

    let reviews = [];
    let avgRating = 0;

    if (user.role === "worker") {
      const reviewData = await Review.aggregate([
        { $match: { workerId: new mongoose.Types.ObjectId(user._id) } },
        {
          $lookup: {
            from: "users",
            localField: "customerId",
            foreignField: "_id",
            as: "customer",
          },
        },
        { $unwind: "$customer" },
        {
          $project: {
            _id: 1,
            rating: 1,
            comment: 1,
            createdAt: 1,
            customer: {
              _id: "$customer._id",
              fullName: "$customer.fullName",
              photo: "$customer.photo",
            },
          },
        },
      ]);

      reviews = reviewData;
      if (reviewData.length > 0) {
        avgRating =
          reviewData.reduce((sum, review) => sum + review.rating, 0) /
          reviewData.length;
      }
    }

    res.status(200).json({
      user,
      reviews,
      avgRating: parseFloat(avgRating.toFixed(2)),
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const updateUserLocation = async (req, res) => {
  try {
    const userId = req.user._id;
    const { latitude, longitude, locationPermissionGranted = true } = req.body;

    if (!latitude || !longitude) {
      return res
        .status(400)
        .json({ message: "Latitude and longitude are required" });
    }

    // Validate coordinates
    if (
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      return res.status(400).json({ message: "Invalid coordinates" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        location: {
          type: "Point",
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
        },
        locationPermissionGranted,
      },
      {
        new: true,
        runValidators: true,
      },
    ).select("-password -refreshToken");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Location updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update location error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getWorkerProfile = async (req, res) => {
  try {
    const { workerId } = req.params;

    if (!workerId) {
      return res.status(400).json({ message: "Worker ID is required" });
    }

    let objectId;

    try {
      objectId = new mongoose.Types.ObjectId(String(workerId));
    } catch (error) {
      return res.status(400).json({ message: "Invalid worker ID" });
    }

    const pipeline = [
      { $match: { _id: objectId, role: "worker" } },
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "workerId",
          as: "reviews",
        },
      },
      {
        $unwind: {
          path: "$reviews",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "reviews.customerId",
          foreignField: "_id",
          as: "reviews.customer",
        },
      },
      {
        $unwind: {
          path: "$reviews.customer",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$_id",
          fullName: { $first: "$fullName" },
          email: { $first: "$email" },
          phoneNumber: { $first: "$phoneNumber" },
          profession: { $first: "$profession" },
          photo: { $first: "$photo" },
          address: { $first: "$address" },
          availabilityTimes: { $first: "$availabilityTimes" },
          location: { $first: "$location" },
          bookingsAday: { $first: "$bookingsAday" },
          isAvailable: { $first: "$isAvailable" },
          experienceYears: { $first: "$experienceYears" },
          completedJobs: { $first: "$completedJobs" },
          totalEarnings: { $first: "$totalEarnings" },
          reviews: {
            $push: {
              _id: "$reviews._id",
              rating: "$reviews.rating",
              comment: "$reviews.comment",
              customer: {
                _id: "$reviews.customer._id",
                fullName: "$reviews.customer.fullName",
                photo: "$reviews.customer.photo",
              },
            },
          },
          avgRating: { $avg: "$reviews.rating" },
          totalReviews: {
            $sum: { $cond: [{ $ne: ["$reviews._id", null] }, 1, 0] },
          },
        },
      },
      {
        $project: {
          _id: 1,
          fullName: 1,
          email: 1,
          phoneNumber: 1,
          profession: 1,
          photo: 1,
          address: 1,
          availabilityTimes: 1,
          location: 1,
          bookingsAday: 1,
          isAvailable: 1,
          experienceYears: 1,
          completedJobs: 1,
          totalEarnings: 1,
          reviews: {
            $filter: {
              input: "$reviews",
              as: "review",
              cond: { $ne: ["$$review._id", null] },
            },
          },
          avgRating: { $ifNull: ["$avgRating", 0] },
          totalReviews: 1,
        },
      },
    ];

    const result = await User.aggregate(pipeline);

    if (result.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Worker not found" });
    }

    res.status(200).json({ success: true, data: result[0] });
  } catch (error) {
    console.error("Error fetching worker profile:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const findNearbyWorkers = async (req, res) => {
  try {
    const { latitude, longitude, radius = 10, serviceCategory } = req.query;

    if (!latitude || !longitude) {
      return res
        .status(400)
        .json({ message: "Latitude and longitude are required" });
    }

    const coordinates = [parseFloat(longitude), parseFloat(latitude)];
    const maxDistance = parseFloat(radius) * 1000; // convert km to meters

    const query = {
      role: "worker",
      isAvailable: true,
      location: {
        $near: {
          $geometry: { type: "Point", coordinates },
          $maxDistance: maxDistance,
        },
      },
    };

    if (serviceCategory) {
      query.profession = serviceCategory;
    }

    const workers = await User.find(query).select(
      "_id fullName profession email photo address availabilityTimes location completedJobs totalEarnings",
    );

    res.status(200).json({ success: true, workers });
  } catch (error) {
    console.error("Error finding nearby workers:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};