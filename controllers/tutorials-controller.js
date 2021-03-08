
const { validationResult } = require('express-validator');
const Tutorials = require('../models/tutorials');
const User = require('../user/user.model');
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
    console.log("erreur pas de datas")
  }
  if (!tutorials) {
    console.log("erreur pas de datas")
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
    console.log("erreur pas de datas")
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
    console.log("erreur pas de datas")
  }
  if (!tutorials || tutorials.length === 0) {
    console.log("erreur pas de datas")
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
      .sort({ date: -1 })
      .limit(7)
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
  if (!tutorials || tutorials.length === 0) {
    console.log("erreur pas de datas")
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
    console.log("erreur pas de datas")
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
    console.log("erreur pas de datas")
  }
  if (!projects || projects.length === 0) {
    console.log("erreur pas de datas")
  }
  res.json({
    projects: projects.map((project) => project.toObject({ getters: true })),
  }); //{creactor: place} => { place: place}
};

const createTutorials = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("erreur pas de datas")
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
    console.log("erreur pas de datas")
  }

  if (!user) {
    console.log("erreur pas de datas")
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
    console.log("erreur pas de datas")
  }

  let tutorials;
  try {
    tutorials = await Tutorials.findById(tutoId);
  } catch (e) {
    console.log("erreur pas de datas")
  }

  if (existingUser.role.toString() === '601724ea6f33a7db18a485c5') {
    console.log('adm');
  } else if (tabs.creator.toString() !== req.userData.userId) {
    console.log("erreur pas de datas")
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
    console.log("erreur pas de datas")
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
    console.log("erreur pas de datas")
  }

  if (tutorials.creator.id !== req.userData.userId) {
    console.log("erreur pas de datas")
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
    console.log("erreur pas de datas")
  }
  let existingUser;
  try {
    existingUser = await User.findById(req.userData.userId);
  } catch (e) {
    console.log("erreur pas de datas")
  }
  if (existingUser.role.toString() === '601724ea6f33a7db18a485c5') {
    console.log('adm');
  } else {
    console.log("erreur pas de datas")
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
