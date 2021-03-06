const { validationResult } = require('express-validator');
const Tabs = require('../models/tabs');
const User = require('../user/user.model');
const mongoose = require('mongoose');
const fs = require('fs');
const ObjectId = mongoose.Types.ObjectId;

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
    console.log("erreur pas de datas")
  }
  res.json({ tabs: tabs.toObject({ getters: true }) }); //{id: place} => { place: place}
};
const getTabsByUserId = async (req, res, next) => {
  const userId = req.params.uid; //{pid: p1}
  let tabs;
  try {
    tabs = await Tabs.find({ creator: userId })
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
    console.log("erreur pas de datas")
  }
  res.json({
    tabs: tabs.map((tab) => tab.toObject({ getters: true })),
  });
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
      })
      .populate({
        path: 'creator',
        select: 'pseudo',
      });
  } catch (e) {
    console.log(e);
  }
  if (!tabs || tabs.length === 0) {
    console.log("erreur pas de datas")
  }
  res.json({
    tabs: tabs.map((tab) => tab.toObject({ getters: true })),
  }); //{creactor: place} => { place: place}
};

const getLastTabs = async (req, res, next) => {
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
      })
      .limit(7)
      .sort({ date: -1 });
  } catch (e) {
    console.log(e);
  }
  if (!tabs || tabs.length === 0) {
    console.log("erreur pas de datas")
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
    console.log("erreur pas de datas")
  }
  if (!tabs || tabs.length === 0) {
    console.log("erreur pas de datas")
  }
  res.json({
    tabs: tabs.map((tab) => tab.toObject({ getters: true })),
  }); //{creactor: place} => { place: place}
};
const getTabsByTypeId = async (req, res, next) => {
  const typeId = req.params.tid; //{pid: p1}

  let tabs;
  try {
    tabs = await Tabs.find({ type: typeId }).limit(5);
  } catch (e) {
    console.log(e);
  }
  if (!tabs || tabs.length === 0) {
    console.log("erreur pas de datas")
  }
  res.json({
    tabs: tabs.map((tab) => tab.toObject({ getters: true })),
  }); //{creactor: place} => { place: place}
};

const createTabs = async (req, res, next) => {
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
    console.log("erreur pas de datas")
  }

  if (!user) {
    console.log("erreur pas de datas")
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
    console.log("erreur pas de datas")
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

  let existingUser;
  try {
    existingUser = await User.findById(req.userData.userId);
  } catch (e) {
    console.log("erreur pas de datas")
  }

  let tabs;
  try {
    tabs = await Tabs.findById(tabsId);
  } catch (e) {
    console.log("erreur pas de datas")
  }

  if (existingUser.role.toString() === '601724ea6f33a7db18a485c5') {
    console.log('adm');
  } else if (tabs.creator.toString() !== req.userData.userId) {
    console.log("erreur pas de datas")
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
    console.log("erreur pas de datas")
  }

  res.status(200).json({ tabs: (await tabs).toObject({ getters: true }) });
};

const deleteTab = async (req, res, next) => {
  const tabtId = req.params.tid; //{pid: p1}
  let tabs;
  try {
    tabs = await Tabs.findById(tabtId).populate('creator');
  } catch (e) {
    console.error(e);
  }

  if (!tabs) {
    console.log("erreur pas de datas")
  }

  if (tabs.creator.toString() !== req.userData.userId) {
    console.log("erreur pas de datas")
  }

  const imagePath = tabs.file;

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await tabs.remove({ session: session });
    tabs.creator.tabs.pull(tabs);
    await tabs.creator.save({ session: session });
    await session.commitTransaction();
  } catch (err) {
    console.log(err);
  }

  fs.unlink(imagePath, (err) => {
    console.log(err);
  });

  res.status(200).json({ message: 'tabs deleted.' });
};
const deleteTabAdmin = async (req, res, next) => {
  const tabtId = req.params.tid; //{pid: p1}
  let tabs;
  console.log(tabtId);
  try {
    tabs = await Tabs.findById(tabtId).populate('creator');
  } catch (e) {
    console.error(e);
  }

  if (!tabs) {
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

  const imagePath = tabs.file;

  try {
    if (tabs.creator !== undefined || tabs.creator !== null) {
      const session = await mongoose.startSession();
      session.startTransaction();
      await tabs.remove({ session: session });
      tabs.creator.tabs.pull(tabs);
      await tabs.creator.save({ session: session });
      await session.commitTransaction();
    } else {
      await tabs.remove(tabs);
    }
  } catch (err) {
    console.log(err);
  }

  if (imagePath) {
    fs.unlink(imagePath, (err) => {
      console.log(err);
    });
  }
  res.status(200).json({ message: 'tabs deleted.' });
};

exports.getTabsById = getTabsById;
exports.getTabs = getTabs;
exports.getLastTabs = getLastTabs;
exports.getTabsByTypeId = getTabsByTypeId;
exports.getTabsByUserId = getTabsByUserId;
exports.getTabsbyInstrumentId = getTabsbyInstrumentId;
exports.createTabs = createTabs;
exports.updateTabs = updateTabs;
exports.deleteTab = deleteTab;
exports.deleteTabAdmin = deleteTabAdmin;
