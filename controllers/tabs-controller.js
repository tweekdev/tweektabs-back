const HttpError = require('../models/http-error');
const { validationResult } = require('express-validator');
const Tabs = require('../models/tabs');
const User = require('../models/user');
const mongoose = require('mongoose');
const fs = require('fs');

const getTabsById = async (req, res, next) => {
  const tabsId = req.params.tid; //{pid: p1}
  let tabs;
  try {
    tabs = await Tabs.findById(tabsId)
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
  if (!tabs) {
    const error = new HttpError(
      'Could not find tabs for the provided id.',
      404
    );
    return next(error);
  }
  res.json({ tabs: tabs.toObject({ getters: true }) }); //{id: place} => { place: place}
};
const getTabs = async (req, res, next) => {
  let tabs;
  try {
    tabs = await Tabs.find({})
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
    console.log(e);
  }
  if (!tabs || tabs.length === 0) {
    return next(
      new HttpError('Could not find tabs for the provided user id.', 404)
    );
  }
  res.json({
    tabs: tabs.map((tab) => tab.toObject({ getters: true })),
  }); //{creactor: place} => { place: place}
};

const getTabsbyInstrumentId = async (req, res, next) => {
  const instrumentId = req.params.iid; //{pid: p1}

  let tabs;
  try {
    tabs = await Tabs.find({ instrument: instrumentId })
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
    const error = new HttpError('Fetching tabs failed, please try again.', 500);
    return next(error);
  }
  if (!tabs || tabs.length === 0) {
    return next(
      new HttpError('Could not find tabs for the provided user id.', 404)
    );
  }
  res.json({
    tabs: tabs.map((tab) => tab.toObject({ getters: true })),
  }); //{creactor: place} => { place: place}
};
const getLastTabs = async (req, res, next) => {
  let tabs;
  try {
    tabs = await Tabs.find({}).limit(4);
  } catch (e) {
    console.log(e);
  }
  if (!tabs || tabs.length === 0) {
    return next(
      new HttpError('Could not find tabs for the provided user id.', 404)
    );
  }
  res.json({
    tabs: tabs.map((tab) => tab.toObject({ getters: true })),
  }); //{creactor: place} => { place: place}
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

const createTabs = async (req, res, next) => {
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
    description,
  } = req.body;
  // const title = req.body.title
  const createdTabs = new Tabs({
    name,
    chanteur,
    type,
    difficulty,
    description,
    instrument,
    link,
    file: req.file.path,
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
    await createdTabs.save({ session: session });
    user.tabs.push(createdTabs);
    await user.save({ session: session });
    await session.commitTransaction();
  } catch (error) {
    console.log(error);
  }

  res.status(201).json({ tabs: createdTabs });
};

const updateTabs = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HttpError(
      'Invalid input passed, please check your data.',
      422
    );
    return next(error);
  }
  const {
    name,
    chanteur,
    type,
    difficulty,
    instrument,
    link,
    description,
  } = req.body;
  const tabsId = req.params.tid; //{pid: p1}

  let tabs;
  try {
    tabs = await Tabs.findById(tabsId);
  } catch (e) {
    const error = new HttpError(
      'Something went wrong, could not update tabs.',
      500
    );
    return next(error);
  }

  tabs.name = name;
  tabs.chanteur = chanteur;
  tabs.type = type;
  tabs.difficulty = difficulty;
  tabs.instrument = instrument;
  tabs.description = description;
  tabs.link = link;
  tabs.file = req.file ? req.file.path : tabs.file;

  try {
    await tabs.save();
  } catch (e) {
    const error = new HttpError(
      'Something went wrong, could not update tabs.',
      500
    );
    return next(error);
  }

  res.status(200).json({ tabs: (await tabs).toObject({ getters: true }) });
};

const deleteProject = async (req, res, next) => {
  const projectId = req.params.pid; //{pid: p1}
  let project;
  try {
    project = await Project.findById(projectId).populate('creator');
  } catch (e) {
    const error = new HttpError(
      'Something went wrong, could not delete project.',
      500
    );
    return next(error);
  }

  if (!project) {
    const error = new HttpError('Could not find project.', 404);
    return next(error);
  }

  if (project.creator.id !== req.userData.userId) {
    const error = new HttpError(
      'You are not allowed to delete this project.',
      401
    );
    return next(error);
  }

  const imagePath = project.image;

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await project.remove({ session: session });
    project.creator.projects.pull(project);
    await project.creator.save({ session: session });
    await session.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete project.',
      500
    );
    return next(error);
  }

  fs.unlink(imagePath, (err) => {
    console.log(err);
  });

  res.status(200).json({ message: 'Project deleted.' });
};

exports.getTabsById = getTabsById;
exports.getTabs = getTabs;
exports.getLastTabs = getLastTabs;
exports.getProjectsByUserId = getProjectsByUserId;
exports.getTabsbyInstrumentId = getTabsbyInstrumentId;
exports.createTabs = createTabs;
exports.updateTabs = updateTabs;
exports.deleteProject = deleteProject;
