const HttpError = require('../models/http-error');
const { validationResult } = require('express-validator');
const Tutorials = require('../models/tutorials');
const User = require('../models/user');
const mongoose = require('mongoose');
const fs = require('fs');

const getTutorialById = async (req, res, next) => {
  const tutorialsId = req.params.tuid; //{pid: p1}
  let tutorials;
  try {
    tutorials = await Tutorials.findById(tutorialsId)
      .populate({
        path: 'type',
        select: 'name',
      })
      .populate({
        path: 'difficulty',
        select: 'name',
      })
      .populate({
        path: 'instrument',
        select: 'name',
      })
      .populate({
        path: 'creator',
        select: 'pseudo picture',
      });
  } catch (e) {
    const error = new HttpError(
      'Something went wrong, could not find a tutorials.',
      500
    );
    return next(error);
  }
  if (!tutorials) {
    const error = new HttpError(
      'Could not find tutorials for the provided id.',
      404
    );
    return next(error);
  }
  res.json({ tutorials: tutorials.toObject({ getters: true }) }); //{id: place} => { place: place}
};
const getTutorials = async (req, res, next) => {
  let tutorials;
  try {
    tutorials = await Tutorials.find({})
      .populate({
        path: 'type',
        select: 'name',
      })
      .populate({
        path: 'difficulty',
        select: 'name',
      })
      .populate({
        path: 'instrument',
        select: 'name',
      })
      .populate({
        path: 'creator',
        select: 'pseudo',
      });
  } catch (e) {
    console.log(e);
  }
  if (!tutorials || tutorials.length === 0) {
    return next(
      new HttpError('Could not find tutorials for the provided user id.', 404)
    );
  }
  res.json({
    tutorials: tutorials.map((tutorial) =>
      tutorial.toObject({ getters: true })
    ),
  }); //{creactor: place} => { place: place}
};

const getTutosbyInstrumentId = async (req, res, next) => {
  const instrumentId = req.params.iid; //{pid: p1}

  let tutorials;
  try {
    tutorials = await tutorials
      .find({ instrument: instrumentId })
      .populate({
        path: 'type',
        select: 'name',
      })
      .populate({
        path: 'difficulty',
        select: 'name',
      })
      .populate({
        path: 'instrument',
        select: 'name',
      });
  } catch (e) {
    const error = new HttpError(
      'Fetching tutorials failed, please try again.',
      500
    );
    return next(error);
  }
  if (!tutorials || tutorials.length === 0) {
    return next(
      new HttpError('Could not find tutorials for the provided user id.', 404)
    );
  }
  res.json({
    tutorials: tutorials.map((tutorials) =>
      tutorials.toObject({ getters: true })
    ),
  }); //{creactor: place} => { place: place}
};
const getLastTutorials = async (req, res, next) => {
  let tutorials;
  try {
    tutorials = await Tutorials.find({})
      .populate({
        path: 'type',
        select: 'name',
      })
      .populate({
        path: 'difficulty',
        select: 'name',
      })
      .populate({
        path: 'instrument',
        select: 'name',
      })
      .limit(7)
      .sort({ date: -1 });
  } catch (e) {
    console.log(e);
  }
  if (!tutorials || tutorials.length === 0) {
    return next(
      new HttpError('Could not find tutorials for the provided user id.', 404)
    );
  }
  res.json({
    tutorials: tutorials.map((tutorial) =>
      tutorial.toObject({ getters: true })
    ),
  }); //{creactor: place} => { place: place}
};

const getTutorialsByUserId = async (req, res, next) => {
  const userId = req.params.uid; //{pid: p1}
  let tutorials;
  try {
    tutorials = await Tutorials.find({ creator: userId })
      .populate({
        path: 'type',
        select: 'name',
      })
      .populate({
        path: 'difficulty',
        select: 'name',
      })
      .populate({
        path: 'instrument',
        select: 'name',
      })
      .populate({
        path: 'creator',
        select: 'pseudo picture',
      });
  } catch (e) {
    console.log(e);
  }
  if (!tutorials) {
    const error = new HttpError(
      'Could not find tutorials for the provided user id.',
      404
    );
    return next(error);
  }
  res.json({
    tutorials: tutorials.map((tutorial) =>
      tutorial.toObject({ getters: true })
    ),
  });
};
const getProjectsByUserId = async (req, res, next) => {
  const userId = req.params.uid; //{pid: p1}

  let projects;
  try {
    projects = await Project.find({ creator: userId });
  } catch (e) {
    const error = new HttpError(
      'Fetching projects failed, please try again.',
      500
    );
    return next(error);
  }
  if (!projects || projects.length === 0) {
    return next(
      new HttpError('Could not find projects for the provided user id.', 404)
    );
  }
  res.json({
    projects: projects.map((project) => project.toObject({ getters: true })),
  }); //{creactor: place} => { place: place}
};

const createTutorials = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid input passed, please check your data.', 422)
    );
  }
  const {
    name,
    chanteur,
    type,
    difficulty,
    instrument,
    link,
    tab,
    description,
  } = req.body;
  // const title = req.body.title
  const createdTutorials = new Tutorials({
    name,
    chanteur,
    type,
    difficulty,
    description,
    instrument,
    link,
    tab,
    date: new Date(),
    creator: req.userData.userId,
  });

  let user;

  try {
    user = await User.findById(req.userData.userId);
  } catch (e) {
    const error = new HttpError(
      'Creating project failed, please try again.',
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
    await createdTutorials.save({ session: session });
    user.tutorials.push(createdTutorials);
    await user.save({ session: session });
    await session.commitTransaction();
  } catch (error) {
    console.log(error);
  }

  res.status(201).json({ tutorials: createdTutorials });
};
const updateTutorial = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
  }
  const {
    name,
    chanteur,
    type,
    difficulty,
    tab,
    instrument,
    link,
    description,
  } = req.body;
  const tutoId = req.params.tid; //{pid: p1}
  let existingUser;
  try {
    existingUser = await User.findById(req.userData.userId);
  } catch (e) {
    const error = new HttpError('Signing failed, please try again.', 401);
    return next(error);
  }

  let tutorials;
  try {
    tutorials = await Tutorials.findById(tutoId);
  } catch (e) {
    const error = new HttpError(
      'Something went wrong, could not update tutorials.',
      500
    );
    return next(error);
  }

  if (existingUser.role.toString() === '601724ea6f33a7db18a485c5') {
    console.log('adm');
  } else if (tabs.creator.toString() !== req.userData.userId) {
    const error = new HttpError('You are not allowed to edit this tabs.', 401);
    return next(error);
  }

  tutorials.name = name;
  tutorials.chanteur = chanteur;
  tutorials.type = type;
  tutorials.tab = tab;
  tutorials.difficulty = difficulty;
  tutorials.instrument = instrument;
  tutorials.description = description;
  tutorials.link = link;

  try {
    await tutorials.save();
  } catch (e) {
    const error = new HttpError(
      'Something went wrong, could not update tutorials.',
      500
    );
    return next(error);
  }

  res
    .status(200)
    .json({ tutorials: (await tutorials).toObject({ getters: true }) });
};

const deleteTuto = async (req, res, next) => {
  const tutorialId = req.params.tid; //{pid: p1}
  let tutorials;
  try {
    tutorials = await Tutorials.findById(tutorialId).populate('creator');
  } catch (e) {
    console.error(e);
  }

  if (!tutorials) {
    const error = new HttpError('Could not find tutorials.', 404);
    return next(error);
  }

  if (tutorials.creator.id !== req.userData.userId) {
    const error = new HttpError(
      'You are not allowed to delete this tutorials.',
      401
    );
    return next(error);
  }

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await tutorials.remove({ session: session });
    tutorials.creator.tutorials.pull(tutorials);
    await tutorials.creator.save({ session: session });
    await session.commitTransaction();
  } catch (err) {
    console.log(err);
  }
  res.status(200).json({ message: 'tutorials deleted.' });
};

const deleteTutoAdmin = async (req, res, next) => {
  const tutorialId = req.params.tid; //{pid: p1}
  let tutorials;
  try {
    tutorials = await Tutorials.findById(tutorialId).populate('creator');
  } catch (e) {
    console.error(e);
  }

  if (!tutorials) {
    const error = new HttpError('Could not find tutorials.', 404);
    return next(error);
  }
  let existingUser;
  try {
    existingUser = await User.findById(req.userData.userId);
  } catch (e) {
    const error = new HttpError('Signing failed, please try again.', 401);
    return next(error);
  }
  if (existingUser.role.toString() === '601724ea6f33a7db18a485c5') {
    console.log('adm');
  } else {
    const error = new HttpError(
      'You are not allowed to edit this tutorials.',
      401
    );
    return next(error);
  }

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await tutorials.remove({ session: session });
    tutorials.creator.tutorials.pull(tutorials);
    await tutorials.creator.save({ session: session });
    await session.commitTransaction();
  } catch (err) {
    console.log(err);
  }

  res.status(200).json({ message: 'tutorials deleted.' });
};

exports.getTutorialById = getTutorialById;
exports.getTutorials = getTutorials;
exports.getLastTutorials = getLastTutorials;
exports.getTutosbyInstrumentId = getTutosbyInstrumentId;
exports.getTutorialsByUserId = getTutorialsByUserId;
exports.createTutorials = createTutorials;
exports.updateTutorial = updateTutorial;
exports.deleteTuto = deleteTuto;
exports.deleteTutoAdmin = deleteTutoAdmin;
