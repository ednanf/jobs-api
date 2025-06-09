const { StatusCodes } = require('http-status-codes');

const {
  BadRequestError,
  UnauthenticatedError,
} = require('../errors/bad-request');
const User = require('../models/User');

const register = async (req, res, next) => {
  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  // Send error if there's no email and/or password
  if (!email || !password) {
    throw new BadRequestError('Please provide email and password.');
  }
  // Find user
  const user = await User.findOne({ email });
  // Send error if there's no user
  if (!user) {
    throw new UnauthenticatedError('Invalid credentials.');
  }
  // Compare passwords
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid credentials.');
  }
  // If everything is correct, create a token and send a response
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

module.exports = { register, login };
