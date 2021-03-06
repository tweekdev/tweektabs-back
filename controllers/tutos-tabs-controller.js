const HttpError = require('../models/http-error');
const { validationResult } = require('express-validator');
const Tabs = require('../models/tabs');
const Instrument = require('../models/instrument');
const mongoose = require('mongoose');
const fs = require('fs');
const ObjectId = mongoose.Types.ObjectId;

const getTutoTabsByInstrumentId = async (req, res, next) => {
  const instrumentId = req.params.iid; //{pid: p1}

  let instruments;
  try {
    instruments = await Instrument.aggregate([
      {
        $lookup: {
          from: 'tabs',
          localField: '_id',
          foreignField: 'instrument',
          as: 'tabs',
        },
      },
      {
        $unwind: {
          path: '$tabs',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'types',
          localField: 'tabs.type',
          foreignField: '_id',
          as: 'tabs.type',
        },
      },
      {
        $lookup: {
          from: 'difficulties',
          localField: 'tabs.difficulty',
          foreignField: '_id',
          as: 'tabs.difficulty',
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
      {
        $unwind: {
          path: '$tutorials',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'types',
          localField: 'tutorials.type',
          foreignField: '_id',
          as: 'tutorials.type',
        },
      },
      {
        $lookup: {
          from: 'difficulties',
          localField: 'tutorials.difficulty',
          foreignField: '_id',
          as: 'tutorials.difficulty',
        },
      },
      {
        $match: { _id: ObjectId(instrumentId) },
      },
      {
        $group: {
          _id: '$_id',
          name: { $first: '$name' },
          tutorials: { $addToSet: '$tutorials' },
          tabs: { $addToSet: '$tabs' },
        },
      },

      {
        $project: {
          _id: '$_id',
          name: 1,
          tabs: {
            $filter: {
              input: '$tabs',
              as: 'a',
              cond: { $ifNull: ['$$a._id', false] },
            },
          },
          tutorials: {
            $filter: {
              input: '$tutorials',
              as: 'a',
              cond: { $ifNull: ['$$a._id', false] },
            },
          },
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
exports.getTutoTabsByInstrumentId = getTutoTabsByInstrumentId;
