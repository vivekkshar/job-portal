import dotenv from "dotenv";
dotenv.config();
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../config/cloudinary.js";
import transporter from "../config/emai.js";
import getDataUri from "../utils/dataUri.js";
import crypto from "crypto";

export const register = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    // Validation
    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All required fields are mandatory",
      });
    }

    // Check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role,
    });

    // Generate JWT token for registered user
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Send cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      data: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getme = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

export const logout = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

export const updateProfile = async (req, res) => {
  try {
    const { bio, phoneNumber, skills } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update Basic Fields
    if (bio) user.profile.bio = bio;
    if (phoneNumber) user.profile.phoneNumber = phoneNumber;

    // Skills
    if (skills) {
      user.profile.skills = skills
        .split(",")
        .map((skill) => skill.trim());
    }

    // Upload Profile Photo
    if (req.files?.profilePhoto) {
      const file = req.files.profilePhoto[0];

      const fileUri = getDataUri(file);

      const result = await cloudinary.uploader.upload(
        fileUri.content,
        {
          folder: "JobPortal/ProfilePhotos",
        }
      );

      user.profile.profilePhoto = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    }

    // Upload Resume
    if (req.files?.resume) {
      const file = req.files.resume[0];

      const fileUri = getDataUri(file);

      const result = await cloudinary.uploader.upload(
        fileUri.content,
        {
          folder: "JobPortal/Resumes",
          resource_type: "raw",
        }
      );

      user.profile.resume = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


// id="4njx1q"
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    // Security: don't reveal whether email exists
    if (!user) {
      return res.status(200).json({
        success: true,
        message:
          "If an account exists with this email, a password reset link will be sent.",
      });
    }

    // Generate secure token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash token before storing in DB
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;

    // Token valid for 15 minutes
    user.resetPasswordExpire =
      Date.now() + 15 * 60 * 1000;

    await user.save();

    // Frontend reset URL
    const resetUrl =
      `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // Send email
    await transporter.sendMail({
      from: `"Job Portal" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Job Portal - Password Reset",
      html: `
        <div style="
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: auto;
          padding: 30px;
          border: 1px solid #ddd;
          border-radius: 10px;
        ">

          <h2 style="color: #2563eb;">
            Reset Your Password
          </h2>

          <p>
            Hello ${user.fullName},
          </p>

          <p>
            We received a request to reset your Job Portal password.
          </p>

          <p>
            Click the button below to create a new password.
          </p>

          <a
            href="${resetUrl}"
            style="
              display: inline-block;
              padding: 12px 20px;
              background-color: #2563eb;
              color: white;
              text-decoration: none;
              border-radius: 6px;
              margin: 15px 0;
            "
          >
            Reset Password
          </a>

          <p>
            This link will expire in <strong>15 minutes</strong>.
          </p>

          <p>
            If you did not request a password reset,
            you can safely ignore this email.
          </p>

          <hr />

          <p style="color: #777; font-size: 12px;">
            Job Portal
          </p>

        </div>
      `,
    });

    return res.status(200).json({
      success: true,
      message:
        "If an account exists with this email, a password reset link will be sent.",
    });

  } catch (error) {
    console.error("Forgot password error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to send password reset email",
    });
  }
};



export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "New password is required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // Hash token received from frontend
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Find user with valid token
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: {
        $gt: Date.now(),
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;

    // Clear reset token
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};


