const HttpError = require('../models/http-error');
const { validationResult } = require('express-validator');
const Type = require('../models/type');
const User = require('../user/user.model');
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

const updateType = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HttpError(
      'Invalid input passed, please check your data.',
      422
    );
    return next(error);
  }
  const { name } = req.body;
  const typeId = req.params.tid; //{pid: p1}

  let type;
  try {
    type = await Type.findById(typeId);
  } catch (e) {
    const error = new HttpError(
      'Something went wrong, could not update type.',
      500
    );
    return next(error);
  }

  type.name = name;

  try {
    await type.save();
  } catch (e) {
    const error = new HttpError(
      'Something went wrong, could not update type.',
      500
    );
    return next(error);
  }

  res.status(200).json({ type: (await type).toObject({ getters: true }) });
};

exports.getTypeById = getTypeById;
exports.getType = getType;
exports.createType = createType;
exports.updateType = updateType;
