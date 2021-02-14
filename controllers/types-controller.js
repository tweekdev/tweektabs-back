const HttpError = require('../models/http-error');
const { validationResult } = require('express-validator');
const Type = require('../models/type');
const User = require('../models/user');
const mongoose = require('mongoose');
const fs = require('fs');

const getTypeById = async (req, res, next) => {
  const typeId = req.params.tid; //{pid: p1}
  let type;
  try {
    type = await Type.findById(typeId);
  } catch (e) {
    const error = new HttpError(
      'Something went wrong, could not find a type.',
      500
    );
    return next(error);
  }
  if (!type) {
    const error = new HttpError(
      'Could not find type for the provided id.',
      404
    );
    return next(error);
  }
  res.json({ type: type.toObject({ getters: true }) }); //{id: place} => { place: place}
};

const getType = async (req, res, next) => {
  let types;
  try {
    types = await Type.find({});
  } catch (e) {
    const error = new HttpError(
      'Fetching types failed, please try again.',
      500
    );
    return next(error);
  }
  if (!types || types.length === 0) {
    return next(new HttpError('Could not find types.', 404));
  }
  res.json({
    types: types.map((type) => type.toObject({ getters: true })),
  }); //{creactor: place} => { place: place}
};

const createType = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid input passed, please check your data.', 422)
    );
  }

  const { name } = req.body;

  // const title = req.body.title
  const createdType = new Type({
    name,
    creator: req.userData.userId,
  });

  try {
    await createdType.save();
  } catch (error) {
    console.log(error);
  }

  res.status(201).json({ type: createdType });
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

exports.getTypeById = getTypeById;
exports.getType = getType;
exports.createType = createType;
exports.updateRole = updateRole;
exports.deleteRole = deleteRole;
