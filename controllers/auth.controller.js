const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/user.model');
const logger = require('../utils/logger');
const { APIError } = require('../utils/apiError');

// Helper function to sign JWT tokens
const signToken = (id) => {
  return jwt.sign({ id }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

// Register a new user with MFA setup
exports.register = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        status: 'error',
        message: 'Email already in use',
      });
    }

    const user = await User.create({ email, password, firstName, lastName });

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    user.otp = otp; // Save OTP to the user model
    await user.save();

    // Simulate sending OTP via email or SMS
    console.log(`OTP for ${email}: ${otp}`);
    // You can use an email or SMS service to send the OTP to the user

    const token = signToken(user._id);

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully. OTP sent for verification.',
      data: { user, token },
    });
  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred during registration',
    });
  }
};

// Login with device fingerprinting
exports.login = async (req, res) => {
  console.log('Login request received:', req.body);
  try {
    const { email, password, deviceFingerprint } = req.body;
    console.log('Login attempt:', email, deviceFingerprint);

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      console.log('Incorrect email or password:', email);
      return res.status(401).json({
        status: 'error',
        message: 'Incorrect email or password',
      });
    }

    // Simulate device fingerprinting check
    logger.info(`Device fingerprint: ${deviceFingerprint}`);

    const token = signToken(user._id);
    console.log('Token generated:', token);
    res.status(200).json({
      status: 'success',
      token,
      data: { user },
    });
    console.log('User logged in successfully:', user.email);
  } catch (error) {
    console.log('Error during login:', error);
    logger.error('Login error:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred during login',
    });
    console.log('An error occurred during login:', error);
  }
};

// Multi-factor authentication verification
exports.verifyMFA = async (req, res) => {
  try {
    const { userId, otp } = req.body;
    console.log('MFA verification request:', userId, otp);

    // Find the user and explicitly include the `otp` field
    const user = await User.findById(userId).select('+otp');
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    // Check if the OTP matches
    if (user.otp !== otp) {
      console.log('Invalid OTP:', otp);
      return res.status(401).json({
        status: 'error',
        message: 'Invalid OTP',
      });
    }

    // Clear the OTP after successful verification
    user.otp = null;
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'MFA verified successfully',
    });
    console.log('MFA verified successfully for user:', userId);
  } catch (error) {
    console.log('Error during MFA verification:', error);
    logger.error('MFA verification error:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred during MFA verification',
    });
  }
};

// JWT refresh mechanism
exports.refreshTokens = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    // Simulate token refresh logic
    const newToken = signToken('userId'); // Replace 'userId' with actual user ID logic
    res.status(200).json({ // Replace httpStatus.OK with 200
      status: 'success',
      token: newToken,
    });
  } catch (error) {
    logger.error('Token refresh error:', error);
    res.status(500).json({ // Replace httpStatus.INTERNAL_SERVER_ERROR with 500
      status: 'error',
      message: 'An error occurred during token refresh',
    });
  }
};

// Password reset initiation
exports.resetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Simulate sending a password reset email
    logger.info(`Password reset email sent to: ${email}`);

    res.status(200).json({ // Replace httpStatus.OK with 200
      status: 'success',
      message: 'Password reset email sent',
    });
  } catch (error) {
    logger.error('Password reset error:', error);
    res.status(500).json({ // Replace httpStatus.INTERNAL_SERVER_ERROR with 500
      status: 'error',
      message: 'An error occurred during password reset',
    });
  }
};

// Password update
exports.updatePassword = async (req, res) => {
  try {
    const { userId, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ // Replace httpStatus.NOT_FOUND with 404
        status: 'error',
        message: 'User not found',
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ // Replace httpStatus.OK with 200
      status: 'success',
      message: 'Password updated successfully',
    });
  } catch (error) {
    logger.error('Password update error:', error);
    res.status(500).json({ // Replace httpStatus.INTERNAL_SERVER_ERROR with 500
      status: 'error',
      message: 'An error occurred during password update',
    });
  }
};

// List active sessions
exports.listSessions = async (req, res) => {
  try {
    // Simulate fetching active sessions
    const sessions = [
      { id: 'session1', device: 'Chrome on Windows', lastActive: '2025-04-18' },
      { id: 'session2', device: 'Safari on iPhone', lastActive: '2025-04-17' },
    ];

    res.status(httpStatus.OK).json({
      status: 'success',
      data: { sessions },
    });
  } catch (error) {
    logger.error('List sessions error:', error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: 'An error occurred while listing sessions',
    });
  }
};

// Revoke specific session
exports.revokeSession = async (req, res) => {
  try {
    const { id } = req.params;

    // Simulate session revocation
    logger.info(`Session revoked: ${id}`);

    res.status(httpStatus.OK).json({
      status: 'success',
      message: 'Session revoked successfully',
    });
  } catch (error) {
    logger.error('Revoke session error:', error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: 'An error occurred while revoking session',
    });
  }
};