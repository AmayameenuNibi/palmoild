import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Company from "../models/company.js";
import generateToken from "../utils/generateToken.js";
import bcrypt from "bcryptjs";

import {
  validateInput,
  validateLoginInput,
  validateEmail,
  validatePassword,
} from "../middleware/validateUser.js";

const passwordreset = asyncHandler(async (req, res) => {
  const { errors, isValid } = validatePassword(req.body);
  const token = req.params.token;
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const { password } = req.body;
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Password reset token is invalid or has expired." });
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      await User.updateOne({ _id: user._id }, {
        password:hashPassword,
      });
    }
    res.status(200).json({ success: 'Password updated' });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

const forgetPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const { errors, isValid } = validateEmail(req.body);
  
  if (!isValid) {
    return res.status(400).json(errors);
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {      
      return res.status(400).json({        
        message: `account error`,
      });
    }
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < 3; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }    
    const token = user._id + result;
    const resetPasswordToken = token;
    const resetPasswordExpires = Date.now() + 3600000;
    await User.updateOne({ _id: user._id }, {
      resetPasswordToken:resetPasswordToken,
      resetPasswordExpires:resetPasswordExpires
    });
    
    return res.status(200).json({
      email: email,
      name:user.name,
      resetPasswordToken: resetPasswordToken      
    });
  } catch (error) {
    return res.status(500).json(errors.message);
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      company: user.company,
      address: user.address,
      country_id: user.country_id,
      mobile: user.mobile,
      role: user.role,
      status:user.status,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc    Register a new user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, company, address, country_id, mobile, password } = req.body;
  const userExists = await User.findOne({ email });  
  const companies = await Company.findOne({ company: company });
  if (companies) {
    res.status(400);
    throw new Error("company already exists");
  }
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }
  const user = await User.create({
    name,
    email,
    company,
    address,
    country_id,
    mobile,
    password,
  });
  if (user) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      company: user.company,
      address: user.address,
      country_id: user.country_id,
      mobile: user.mobile,
      role: user.role,
      status:user.status,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Logout user / clear cookie
const logoutUser = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
};

// @desc    Get user profile
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      company: user.company,
      address: user.address,
      country_id: user.country_id,
      mobile: user.mobile,
      role: user.role,
      status:user.status,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.company = req.body.company || user.company;
    user.address = req.body.address || user.address;
    user.country_id = req.body.country_id || user.country_id;
    user.mobile = req.body.mobile || user.mobile;
    if (req.body.password) {
      user.password = req.body.password;
    }
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      company: updatedUser.company,
      address: updatedUser.address,
      country_id: updatedUser.country_id,
      mobile: updatedUser.mobile,
      role: updatedUser.role,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const { userId, transactionId } = req.body;
  try {
    await User.updateOne({ _id: userId }, {
      status: 1,
      transaction_id: transactionId
    });
    const user = await User.findOne({ _id: userId });
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        company: user.company,
        address: user.address,
        country_id: user.country_id,
        mobile: user.mobile,
        role: user.role,
        status:user.status,
      });
    } else {
      res.status(401);
      throw new Error("Invalid email or password");
    }
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});
const updateUserD = asyncHandler(async (req, res) => {
  const { userId, company, address, country_id, mobile,transactionId,status } = req.body;
    try {
    await User.updateOne({ _id: userId }, {
      company: company,
      address: address,
      country_id: country_id,
      mobile: mobile,
      status:status,
      transaction_id:transactionId
    });
    const user = await User.findOne({ _id: userId });
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        company: user.company,
        address: user.address,
        country_id: user.country_id,
        mobile: user.mobile,
        role: user.role,
        status:user.status,
      });
    } 
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});


const activeUser = asyncHandler(async (req, res) => {
  try {
    const activeUsers = await User.find({ status: 1 });
    res.json(activeUsers);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

const inactiveUser = asyncHandler(async (req, res) => {
  try {
    const inactiveUsers = await User.find({ status: 0 });
    res.json(inactiveUsers);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

export {
  activeUser,
  inactiveUser,
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  updateUser,
  updateUserD,
  forgetPassword,
  passwordreset
};
