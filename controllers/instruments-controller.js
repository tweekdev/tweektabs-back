const HttpError = require('../models/http-error');
const { validationResult } = require('express-validator');
const Instrument = require('../models/instrument');
const Tabs = require('../models/tabs');
const User = require('../models/user');
const mongoose = require('mongoose');
const fs = require('fs');

const getInstrumentById = async (req, res, next) => {
  const instrumentId = req.params.iid; //{pid: p1}
  let instrument;
  try {
    instrument = await Instrument.findById(instrumentId);
  } catch (e) {
    const error = new HttpError(
      'Something went wrong, could not find a instrument.',
      500
    );
    return next(error);
  }
  if (!instrument) {
    const error = new HttpError(
      'Could not find instrument for the provided id.',
      404
    );
    return next(error);
  }
  res.json({ instrument: instrument.toObject({ getters: true }) }); //{id: place} => { place: place}
};

const getInstrument = async (req, res, next) => {
  let instruments;
  try {
    instruments = await Instrument.find({});
  } catch (e) {
    const error = new HttpError(
      'Fetching instruments failed, please try again.',
      500
    );
    return next(error);
  }
  if (!instruments || instruments.length === 0) {
    return next(new HttpError('Could not find instruments.', 404));
  }
  res.json({
    instruments: instruments.map((instrument) =>
      instrument.toObject({ getters: true })
    ),
  }); //{creactor: place} => { place: place}
};
const getLastInstrument = async (req, res, next) => {
  let instruments;
  try {
    instruments = await Instrument.find({}).limit(4);
  } catch (e) {
    const error = new HttpError(
      'Fetching instruments failed, please try again.',
      500
    );
    return next(error);
  }
  if (!instruments || instruments.length === 0) {
    return next(new HttpError('Could not find instruments.', 404));
  }
  res.json({
    instruments: instruments.map((instrument) =>
      instrument.toObject({ getters: true })
    ),
  }); //{creactor: place} => { place: place}
};

const getInstrumentByTabsId = async (req, res, next) => {
  const tabsId = req.params.tid; //{pid: p1}

  let instruments;
  try {
    instruments = await Role.find({ tabs: tabsId });
  } catch (e) {
    const error = new HttpError(
      'Fetching instruments failed, please try again.',
      500
    );
    return next(error);
  }
  if (!instruments || instruments.length === 0) {
    return next(
      new HttpError('Could not find instruments for the provided user id.', 404)
    );
  }
  res.json({
    instruments: instruments.map((instrument) =>
      instrument.toObject({ getters: true })
    ),
  }); //{creactor: place} => { place: place}
};

const getTutosbyInstrumentId = async (req, res, next) => {
  const instrumentId = req.params.iid; //{pid: p1}

  let instruments;
  try {
    instruments = await Instrument.aggregate([
      {
        $match: {
          _id: instrumentId,
        },
      },
      {
        $lookup: {
          from: 'tutorials',
          localField: '_id',
          foreignField: 'instrument',
          as: 'tutorials',
        },
      },
    ]);
  } catch (e) {
    console.log(e);
  }
  res.json({
    instruments: instruments.map((instrument) => instrument),
  }); //{creactor: place} => { place: place}
};

const createInstrument = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid input passed, please check your data.', 422)
    );
  }

  const { name } = req.body;

  // const title = req.body.title
  const createdInstrument = new Instrument({
    name,
    creator: req.userData.userId,
  });

  let user;

  try {
    user = await User.findById(req.userData.userId);
  } catch (e) {
    const error = new HttpError(
      'Creating instrument failed, please try again.',
      500
    );
    return next(error);
  }

  try {
    await createdInstrument.save();
  } catch (error) {
    console.log(error);
  }

  res.status(201).json({ instrument: createdInstrument });
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

exports.getInstrumentById = getInstrumentById;
exports.getInstrumentByTabsId = getInstrumentByTabsId;
exports.getTutosbyInstrumentId = getTutosbyInstrumentId;
exports.getLastInstrument = getLastInstrument;
exports.getInstrument = getInstrument;
exports.createInstrument = createInstrument;
exports.updateRole = updateRole;
exports.deleteRole = deleteRole;
