import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';
import jwt from 'jsonwebtoken';

// @desc    Auth user & get token
// @route   POST /api/users/auth
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {

    const token = generateToken( user._id, user.name, user.email, user.phone, user.permission);

    const userdata = {
      _id: user._id,
      name: user.name,
      email: user.email,
      permission: user.permission,
      phone: user.phone
    }

    const data = {
      user: userdata,
      token: token
    }

    res.send(data);

  } else {

    res.status(401);
    throw new Error('Invalid email or password');
    
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  console.log(req.body.name)
  const { name, email, password, phone } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    phone,
    password,
    permission: "customer"
  });

  if (user) {
    // generateToken(res, user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      permission: user.permission,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
export const logoutUser = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});


export const refreshToken = asyncHandler(async (req, res) => {
  console.log("1")
  const token = req.headers.authorization;
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.json({ status: 'failed', message: "Expired token" });
      }
    } else {
      let email = decoded.email;
      const user = await User.find({ email: email });

      if (user) {
        const token = generateToken(user._id, user.name, user.email, user.phone, user.permission);
        const userdata = {
          _id: user._id,
          name: user.name,
          email: user.email,
          permission: user.permission,
          phone: user.phone
        }
        const data = {
          user: userdata,
          token: token
        }
        res.json({ data: data, status: 'success', message: "Authorized" });
      } else {
        res.json({ status: 'failed', message: 'Token Invalid. Your account was hacked. Ask for support team.' });
      }
    }
  });
});
