const HttpError = require('../models/http-error');
const { validationResult } = require('express-validator');
const Difficulty = require('../models/difficulty');
const User = require('../models/user');
const mongoose = require('mongoose');
const fs = require('fs');

const getDifficultyById = async (req, res, next) => {
  const difficultyId = req.params.did; //{pid: p1}
  let difficulty;
  try {
    difficulty = await Difficulty.findById(difficultyId);
  } catch (e) {
    const error = new HttpError(
      'Something went wrong, could not find a difficulty.',
      500
    );
    return next(error);
  }
  if (!difficulty) {
    const error = new HttpError(
      'Could not find difficulty for the provided id.',
      404
    );
    return next(error);
  }
  res.json({ difficulty: difficulty.toObject({ getters: true }) }); //{id: place} => { place: place}
};

const getDifficulty = async (req, res, next) => {
  let difficulties;
  try {
    difficulties = await Difficulty.find({});
  } catch (e) {
    const error = new HttpError(
      'Fetching difficulties failed, please try again.',
      500
    );
    return next(error);
  }
  if (!difficulties || difficulties.length === 0) {
    return next(new HttpError('Could not find difficulties.', 404));
  }
  res.json({
    difficulties: difficulties.map((difficulty) =>
      difficulty.toObject({ getters: true })
    ),
  }); //{creactor: place} => { place: place}
};

const createDifficulty = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid input passed, please check your data.', 422)
    );
  }

  const { name } = req.body;

  // const title = req.body.title
  const createdDifficulty = new Difficulty({
    name,
    creator: req.userData.userId,
  });

  try {
    await createdDifficulty.save();
  } catch (error) {
    console.log(error);
  }

  res.status(201).json({ difficulty: createdDifficulty });
};

const updateDifficulty = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HttpError(
      'Invalid input passed, please check your data.',
      422
    );
    return next(error);
  }
  const { name } = req.body;
  const difficultyId = req.params.did; //{pid: p1}

  let difficulty;
  try {
    difficulty = await Difficulty.findById(difficultyId);
  } catch (e) {
    const error = new HttpError(
      'Something went wrong, could not update difficulty.',
      500
    );
    return next(error);
  }

  difficulty.name = name;

  try {
    await difficulty.save();
  } catch (e) {
    const error = new HttpError(
      'Something went wrong, could not update difficulty.',
      500
    );
    return next(error);
  }

  res
    .status(200)
    .json({ difficulty: (await difficulty).toObject({ getters: true }) });
};

exports.getDifficultyById = getDifficultyById;
exports.getDifficulty = getDifficulty;
exports.createDifficulty = createDifficulty;
exports.updateDifficulty = updateDifficulty;
