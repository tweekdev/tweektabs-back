const Instrument = require('../models/instrument');
const Tabs = require('../models/tabs');
const User = require('../user/user.model');
const mongoose = require('mongoose');
const fs = require('fs');

const getInstrumentById = async (req, res, next) => {
  const instrumentId = req.params.iid; //{pid: p1}
  let instrument;
  try {
    instrument = await Instrument.findById(instrumentId);
  } catch (e) {
    console.log(e)
  }
  if (!instrument) {
    console.log("erreur pas de datas")
  }
  res.json({ instrument: instrument.toObject({ getters: true }) }); //{id: place} => { place: place}
};

const getInstrument = async (req, res, next) => {
  let instruments;
  try {
    instruments = await Instrument.find({});
  } catch (e) {
    console.log(e)
  }
  if (!instruments || instruments.length === 0) {
    console.log("erreur pas de datas")
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
    console.log(e)
  }
  if (!instruments || instruments.length === 0) {
    console.log("erreur pas de datas")
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
    console.log(e)
  }
  if (!instruments || instruments.length === 0) {
    console.log("erreur pas de datas")
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
  });
};

const createInstrument = async (req, res, next) => {


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
    console.log(e)
  }

  try {
    await createdInstrument.save();
  } catch (error) {
    console.log(error);
  }

  res.status(201).json({ instrument: createdInstrument });
};

const updateInstrument = async (req, res, next) => {
  const { name } = req.body;
  const instrumentId = req.params.iid; //{pid: p1}

  let instrument;
  try {
    instrument = await Instrument.findById(instrumentId);
  } catch (e) {
    console.log(e)
  }
  /*
  if (instrument.creator.toString() !== req.userData.userId) {
    const error = new HttpError(
      'You are not allowed to edit this instrument.',
      401
    );
    return next(error);
  }
	*/
  instrument.name = name;

  try {
    await instrument.save();
  } catch (e) {
    console.log(e)
  }

  res
    .status(200)
    .json({ instrument: (await instrument).toObject({ getters: true }) });
};

exports.getInstrumentById = getInstrumentById;
exports.getInstrumentByTabsId = getInstrumentByTabsId;
exports.getTutosbyInstrumentId = getTutosbyInstrumentId;
exports.getLastInstrument = getLastInstrument;
exports.getInstrument = getInstrument;
exports.createInstrument = createInstrument;
exports.updateInstrument = updateInstrument;
