const User = require("../models/user");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendMail");
const OTPModel = require("../models/otpModel");

class authController {
  async userRegister(req, res) {
    try {
      const { name, email, password, about } = req.body;
      if (!name || !email || !password || !about) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        });
      }

      const existsUser = await User.findOne({ email });
      if (existsUser) {
        return res.status(401).json({
          success: false,
          message: "User already exists",
        });
      }

      const userData = {
        name,
        email,
        password,
        about,
      };

      const HashPassword = await bcrypt.hash(password, 10);

      userData.password = HashPassword;

      const user = await new User(userData).save();

      await sendEmail(req, user);
      return res.status(201).json({
        success: true,
        message:
          "User registered successfully & otp send to your email please verify",
        user,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }

  //verify otp before login
  async verify(req, res) {
    try {
      const { email, otp } = req.body;
      // Check if all required fields are provided
      if (!email || !otp) {
        return res
          .status(400)
          .json({ status: false, message: "All fields are required" });
      }
      const existingUser = await User.findOne({ email });

      // Check if email doesn't exists
      if (!existingUser) {
        return res
          .status(404)
          .json({ status: "failed", message: "Email doesn't exists" });
      }

      // Check if email is already verified
      if (existingUser.is_verified) {
        return res
          .status(400)
          .json({ status: false, message: "Email is already verified" });
      }
      // Check if there is a matching email verification OTP
      const emailVerification = await OTPModel.findOne({
        userId: existingUser._id,
        otp,
      });
      if (!emailVerification) {
        if (!existingUser.is_verified) {
          // console.log(existingUser);
          await sendEmail(req, existingUser);
          return res.status(400).json({
            status: false,
            message: "Invalid OTP, new OTP sent to your email please verify",
          });
        }
        return res.status(400).json({ status: false, message: "Invalid OTP" });
      }
      // Check if OTP is expired
      const currentTime = new Date();
      // 5 * 60 * 1000 calculates the expiration period in milliseconds(5 minutes).
      const expirationTime = new Date(
        emailVerification.createdAt.getTime() + 5 * 60 * 1000,
      );
      if (currentTime > expirationTime) {
        // OTP expired, send new OTP
        await sendEmail(req, existingUser);
        return res.status(400).json({
          status: "failed",
          message: "OTP expired, new OTP sent to your email",
        });
      }
      // OTP is valid and not expired, mark email as verified
      existingUser.is_verified = true;
      await existingUser.save();

      // Delete email verification document
      await OTPModel.deleteMany({ userId: existingUser._id });
      return res
        .status(200)
        .json({ status: true, message: "Email verified successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        message: "Unable to verify email, please try again later",
      });
    }
  }

  async userLogin(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User not found",
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Password not matched",
        });
      }

      if (!user.is_verified) {
        return res.status(401).json({
          success: false,
          message: "Invalid OTP please verify before login",
        });
      }

      if (user) {
        const token = jwt.sign(
          {
            id: user._id,
            name: user.name,
            email: user.email,
            about: user.about,
          },
          process.env.JWT_SECRET_KEY,
          { expiresIn: "10m" },
        );

        return res.status(200).json({
          success: true,
          message: "User logged in successfully",
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            about: user.about,
          },
          token,
        });
      } else {
        res.status(404).json({ success: false, message: "login failed" });
      }
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
}

module.exports = new authController();
