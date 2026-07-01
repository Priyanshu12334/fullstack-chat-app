import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  const { fullName, email, username, password } = req.body;
  try {
    if (!fullName || !email || !username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const emailUser = await User.findOne({ email });
    if (emailUser) return res.status(400).json({ message: "Email already exists" });

    const sanitizedUsername = username.trim().toLowerCase();
    const usernameRegex = /^[a-z0-9_.]+$/;
    if (!usernameRegex.test(sanitizedUsername)) {
      return res.status(400).json({ message: "Username can only contain lowercase letters, numbers, underscores, and dots" });
    }

    const usernameUser = await User.findOne({ username: sanitizedUsername });
    if (usernameUser) return res.status(400).json({ message: "Username already taken" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      username: sanitizedUsername,
      password: hashedPassword,
      bio: "",
    });

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        username: newUser.username,
        bio: newUser.bio,
        profilePic: newUser.profilePic,
        createdAt: newUser.createdAt,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({
      $or: [
        { email: email },
        { username: email.toLowerCase() }
      ]
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      username: user.username,
      bio: user.bio || "",
      profilePic: user.profilePic,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  try {
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("jwt", "", {
      maxAge: 0,
      httpOnly: true,
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction,
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic, fullName, username, bio } = req.body;
    const userId = req.user._id;

    const updateData = {};

    if (fullName) {
      if (fullName.trim().length === 0) {
        return res.status(400).json({ message: "Full name cannot be empty" });
      }
      updateData.fullName = fullName.trim();
    }

    if (username) {
      const sanitizedUsername = username.trim().toLowerCase();
      const usernameRegex = /^[a-z0-9_.]+$/;
      if (!usernameRegex.test(sanitizedUsername)) {
        return res.status(400).json({ message: "Username can only contain lowercase letters, numbers, underscores, and dots" });
      }

      const existingUser = await User.findOne({ username: sanitizedUsername });
      if (existingUser && existingUser._id.toString() !== userId.toString()) {
        return res.status(400).json({ message: "Username already taken" });
      }
      updateData.username = sanitizedUsername;
    }

    if (bio !== undefined) {
      updateData.bio = bio.trim();
    }

    if (profilePic) {
      const uploadResponse = await cloudinary.uploader.upload(profilePic, {
        folder: "chat_app_avatars",
        resource_type: "image",
      });

      if (!uploadResponse?.secure_url) {
        return res.status(500).json({ message: "Image upload failed" });
      }
      updateData.profilePic = uploadResponse.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select("-password");

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("error in update profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
