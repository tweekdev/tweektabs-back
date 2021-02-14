const HttpError = require('../models/http-error');
const User = require('../models/user');
const Role = require('../models/role');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, '-password').populate({
      path: 'role',
      select: 'name',
    });
  } catch (e) {
    const error = new HttpError(
      'Fetching users failed, please try again.',
      500
    );
    return next(error);
  }
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const getUsersByTabs = async (req, res, next) => {
  const tabsId = req.params.tid; //{pid: p1}

  let users;
  try {
    users = await User.find({ tabs: tabsId }, '-password')
      .populate({
        path: 'tabs',
        select: 'name',
      })
      .populate({
        path: 'role',
        select: 'name',
      });
  } catch (e) {
    const error = new HttpError('Fetching tabs failed, please try again.', 500);
    return next(error);
  }
  if (!users || users.length === 0) {
    return next(
      new HttpError('Could not find tabs for the provided user id.', 404)
    );
  }
  res.json({
    users: users.map((user) => user.toObject({ getters: true })),
  }); //{creactor: place} => { place: place}
};
const getUsersById = async (req, res, next) => {
  const userId = req.params.uid; //{pid: p1}

  let users;
  try {
    users = await User.find({ _id: userId }, '-password').populate({
      path: 'role',
      select: 'name',
    });
  } catch (e) {
    const error = new HttpError('Fetching tabs failed, please try again.', 500);
    return next(error);
  }
  if (!users || users.length === 0) {
    return next(
      new HttpError('Could not find tabs for the provided user id.', 404)
    );
  }
  res.json({
    users: users.map((user) => user.toObject({ getters: true })),
  }); //{creactor: place} => { place: place}
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
  }

  const {
    firstname,
    name,
    pseudo,
    email,
    password,
    role,
    tabs,
    tutorials,
  } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (e) {
    const error = new HttpError('Signing failed, please try again.', 401);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError('User already exists, please login.', 422);
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (e) {
    const error = new HttpError(
      'Could not create user, please try again.',
      500
    );
    return next(error);
  }

  const createdUser = new User({
    firstname,
    name,
    pseudo,
    email,
    password: hashedPassword,
    role,
    tabs: tabs ? tabs : [],
    tutorials: tutorials ? tutorials : [],
    news: [],
  });

  try {
    await createdUser.save();
  } catch (e) {
    const error = new HttpError('Creating user failed, please try again.', 401);
    return next(error);
  }

  //jwt token
  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      process.env.JWT_KEY,
      { expiresIn: '1h' }
    );
  } catch (e) {
    const error = new HttpError('Signing failed, please try again.', 401);
    return next(error);
  }

  res.status(201).json({
    userId: createdUser.id,
    email: createdUser.email,
    token: token,
    role: createdUser.role,
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      'Logging in failed, please try again later.',
      500
    );
    return next(error);
  }

  let isValidPassword = true;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (e) {
    const error = new HttpError(
      'Could not log you in , please try again.',
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      'Invalid credentials, could not log you in.',
      403
    );
    return next(error);
  }

  //jwt token
  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      process.env.JWT_KEY,
      { expiresIn: '1h' }
    );
  } catch (e) {
    const error = new HttpError('Logging in failed, please try again.', 401);
    return next(error);
  }

  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    token: token,
    role: existingUser.role,
    tabs: existingUser.tabs,
  });
};

const updateUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HttpError(
      'Invalid input passed, please check your data.',
      422
    );
    return next(error);
  }

  const { firstname, name, pseudo, role, email } = req.body;
  const userId = req.params.uid; //{pid: p1}

  let user;
  try {
    user = await User.findById(userId);
  } catch (e) {
    const error = new HttpError(
      'Something went wrong, could not update project.',
      500
    );
    return next(error);
  }
  user.firstname = firstname;
  user.name = name;
  user.pseudo = pseudo;
  user.role = role;
  user.email = email;

  try {
    await user.save();
  } catch (e) {
    const error = new HttpError(
      'Something went wrong, could not update project.',
      500
    );
    return next(error);
  }

  res.status(200).json({ user: (await user).toObject({ getters: true }) });
};

exports.getUsers = getUsers;
exports.getUsersById = getUsersById;
exports.signup = signup;
exports.login = login;
exports.getUsersByTabs = getUsersByTabs;
exports.updateUser = updateUser;
