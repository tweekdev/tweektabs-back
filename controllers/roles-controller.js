const HttpError = require('../models/http-error');
const { validationResult } = require('express-validator');
const Role = require('../models/role');
const User = require('../user/user.model');
const mongoose = require('mongoose');
const fs = require('fs');

const getRoleById = async (req, res, next) => {
  const roleId = req.params.pid; //{pid: p1}
  let role;
  try {
    role = await Role.findById(roleId);
  } catch (e) {
    const error = new HttpError(
      'Something went wrong, could not find a role.',
      500
    );
    return next(error);
  }
  if (!role) {
    const error = new HttpError(
      'Could not find role for the provided id.',
      404
    );
    return next(error);
  }
  res.json({ role: role.toObject({ getters: true }) }); //{id: place} => { place: place}
};

const getRole = async (req, res, next) => {
  let roles;
  try {
    roles = await Role.find({});
  } catch (e) {
    const error = new HttpError(
      'Fetching roles failed, please try again.',
      500
    );
    return next(error);
  }
  if (!roles || roles.length === 0) {
    return next(new HttpError('Could not find roles.', 404));
  }
  res.json({
    roles: roles.map((role) => role.toObject({ getters: true })),
  }); //{creactor: place} => { place: place}
};

const getRoleByUserId = async (req, res, next) => {
  const userId = req.params.uid; //{pid: p1}

  let roles;
  try {
    roles = await Role.find({ creator: userId });
  } catch (e) {
    const error = new HttpError(
      'Fetching roles failed, please try again.',
      500
    );
    return next(error);
  }
  if (!roles || roles.length === 0) {
    return next(
      new HttpError('Could not find roles for the provided user id.', 404)
    );
  }
  res.json({
    roles: roles.map((role) => role.toObject({ getters: true })),
  }); //{creactor: place} => { place: place}
};

const createRole = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid input passed, please check your data.', 422)
    );
  }
  const { name } = req.body;

  // const title = req.body.title
  const createdRole = new Role({
    name,
    creator: req.userData.userId,
  });

  let user;

  try {
    user = await User.findById(req.userData.userId);
  } catch (e) {
    const error = new HttpError(
      'Creating course failed, please try again.',
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError('Could not find user for provided id.', 404);
    return next(error);
  }

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await createdRole.save({ session: session });
    user.role.push(createdRole);
    await user.save({ session: session });
    await session.commitTransaction();
  } catch (error) {
    return next(new HttpError('Create role failed, please try again.', 500));
  }

  res.status(201).json({ role: createdRole });
};

const updateRole = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HttpError(
      'Invalid input passed, please check your data.',
      422
    );
    return next(error);
  }
  const { name } = req.body;
  const roleId = req.params.pid; //{pid: p1}

  let role;
  try {
    role = await Role.findById(roleId);
  } catch (e) {
    const error = new HttpError(
      'Something went wrong, could not update role.',
      500
    );
    return next(error);
  }

  if (role.creator.toString() !== req.userData.userId) {
    const error = new HttpError('You are not allowed to edit this role.', 401);
    return next(error);
  }
  role.name = name;

  try {
    await role.save();
  } catch (e) {
    const error = new HttpError(
      'Something went wrong, could not update role.',
      500
    );
    return next(error);
  }

  res.status(200).json({ role: (await role).toObject({ getters: true }) });
};

const deleteRole = async (req, res, next) => {
  const roleId = req.params.pid; //{pid: p1}
  let role;
  try {
    role = await Role.findById(roleId).populate('creator');
  } catch (e) {
    const error = new HttpError(
      'Something went wrong, could not delete role.',
      500
    );
    return next(error);
  }

  if (!role) {
    const error = new HttpError('Could not find role.', 404);
    return next(error);
  }

  if (role.creator.id !== req.userData.userId) {
    const error = new HttpError(
      'You are not allowed to delete this role.',
      401
    );
    return next(error);
  }

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await role.remove({ session: session });
    role.creator.roles.pull(role);
    await role.creator.save({ session: session });
    await session.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete role.',
      500
    );
    return next(error);
  }

  res.status(200).json({ message: 'Role deleted.' });
};

exports.getRoleById = getRoleById;
exports.getRoleByUserId = getRoleByUserId;
exports.getRole = getRole;
exports.createRole = createRole;
exports.updateRole = updateRole;
exports.deleteRole = deleteRole;
