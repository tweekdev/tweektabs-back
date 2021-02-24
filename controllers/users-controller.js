const HttpError = require('../models/http-error');
const User = require('../models/user');
const Role = require('../models/role');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const publicIp = require('public-ip');

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

  res.json({
    users: users.map((user) => user.toObject({ getters: true })),
  }); //{creactor: place} => { place: place}
};

const signup = async (req, res, next) => {
  const admin = '601724ea6f33a7db18a485c5';
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
    picture: req.file.path ? req.file.path : null,
    tabs: tabs ? tabs : [],
    tutorials: tutorials ? tutorials : [],
    news: [],
  });
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: process.env.EMAIL_PORT,
    secure: true,
    requireTLS: true,
    auth: {
      user: `${process.env.EMAIL_ADDRESS}`,
      pass: `${process.env.EMAIL_PASSWORD}`,
    },
  });
  var mailOptions = {
    from: 'tweekTabs',
    to: createdUser.email,
    subject: 'Bienvenue sur TweekTabs !',
    html: `<h1>Bienvenue ${createdUser.pseudo}</h1>
		<p>Tu peux aller parcourir et trouver les tabs qui te plaisent ! ;)</p>
				<br/>
		<p>Bonne journée!</p>
		<br/>
		<p>l'équipe TweekTabs</p>`,
  };

  try {
    await createdUser.save();

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  } catch (e) {
    console.log(e);
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
    pseudo: createdUser.pseudo,
    picture: createdUser.picture,
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  var dateConnexion = new Date();
  let date = ('0' + dateConnexion.getDate()).slice(-2);

  // current month
  let month = ('0' + (dateConnexion.getMonth() + 1)).slice(-2);

  // current year
  let year = dateConnexion.getFullYear();

  // current hours
  let hours = dateConnexion.getHours();

  // current minutes
  let minutes = dateConnexion.getMinutes();

  // current seconds
  let seconds = dateConnexion.getSeconds();
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
  const ip = await publicIp.v4();
  //=> '46.5.21.123'

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: process.env.EMAIL_PORT,
    secure: true,
    requireTLS: true,
    auth: {
      user: `${process.env.EMAIL_ADDRESS}`,
      pass: `${process.env.EMAIL_PASSWORD}`,
    },
  });
  var mailOptions = {
    from: 'tweekTabs',
    to: existingUser.email,
    subject: 'TweekTabs connexion !',
    html: `<h1>Bonjour ${existingUser.pseudo} !</h1>
		<p>Nous avons détecté une tentative de connexion le ${
      date +
      '-' +
      month +
      '-' +
      year +
      ' à ' +
      hours +
      ':' +
      minutes +
      ':' +
      seconds
    } avec l'adresse IP : ${ip} </p>
		<br/>
		<p>Bonne journée!</p>
		<br/>
		<p>l'équipe TweekTabs</p>`,
  };
  //jwt token
  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      process.env.JWT_KEY,
      { expiresIn: '1h' }
    );
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  } catch (e) {
    const error = new HttpError('Logging in failed, please try again.', 401);
    return next(error);
  }

  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    token: token,
    role: existingUser.role,
    pseudo: existingUser.pseudo,
    picture: existingUser.picture,
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
      'Something went wrong, could not update user.',
      500
    );
    return next(error);
  }
  user.firstname = firstname;
  user.name = name;
  user.pseudo = pseudo;
  user.role = role;
  user.email = email;
  user.picture = req.file ? req.file.path : user.picture;
  try {
    await user.save();
  } catch (e) {
    console.log(e);
  }

  res.status(200).json({ user: (await user).toObject({ getters: true }) });
};
const updateUserPassword = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HttpError(
      'Invalid input passed, please check your data.',
      422
    );
    return next(error);
  }

  const { password } = req.body;
  const userId = req.params.uid; //{pid: p1}

  let user;
  try {
    user = await User.findById(userId);
  } catch (e) {
    const error = new HttpError(
      'Something went wrong, could not update password user.',
      500
    );
    return next(error);
  }
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: process.env.EMAIL_PORT,
    secure: true,
    requireTLS: true,
    auth: {
      user: `${process.env.EMAIL_ADDRESS}`,
      pass: `${process.env.EMAIL_PASSWORD}`,
    },
  });
  var mailOptions = {
    from: 'tweekTabs',
    to: user.email,
    subject: 'Mise à jour mot de passe TweekTabs !',
    html: `<h1>Bonjour ${user.pseudo} </h1>
		<p>Ton mot de passe a bien été mis à jour! ;)</p>
		<br/>
		<p>Bonne journée!</p>
		<br/>
		<p>l'équipe TweekTabs</p>`,
  };
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (e) {
    const error = new HttpError(
      'Could not update user password, please try again.',
      500
    );
    return next(error);
  }
  user.password = hashedPassword;
  try {
    await user.save();
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  } catch (e) {
    console.log(e);
  }

  res.status(200).json({ user: (await user).toObject({ getters: true }) });
};

exports.getUsers = getUsers;
exports.getUsersById = getUsersById;
exports.signup = signup;
exports.login = login;
exports.getUsersByTabs = getUsersByTabs;
exports.updateUser = updateUser;
exports.updateUserPassword = updateUserPassword;
