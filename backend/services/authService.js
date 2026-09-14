// services/authService.js
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const registerUserService = async (userData) => {
  const { name, email, phone, password, role } = userData;

  const userExists = await User.findOne({ phone });
  if (userExists) {
    const error = new Error("User already exists with this phone number");
    error.statusCode = 400;
    throw error;
  }

  if (email) {
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      const error = new Error("User already exists with this email");
      error.statusCode = 400;
      throw error;
    }
  }

  const user = await User.create({
    name,
    email: email || undefined,
    phone,
    password,
    role: role || "patient",
  });

  if (!user) {
    const error = new Error("Invalid user data");
    error.statusCode = 400;
    throw error;
  }

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    token: generateToken(user._id),
  };
};

const loginUserService = async (credentials) => {
  const { phone, email, password } = credentials;

  const query = phone ? { phone } : { email };
  const user = await User.findOne(query).select("+password");

  if (user && (await user.matchPassword(password))) {
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token: generateToken(user._id),
    };
  } else {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }
};

const getUserProfileService = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
  return user;
};

module.exports = {
  registerUserService,
  loginUserService,
  getUserProfileService,
};