
const Difficulty = require('../models/difficulty');
const User = require('../user/user.model');
const mongoose = require('mongoose');
const fs = require('fs');

const getDifficultyById = async (req, res, next) => {
  const difficultyId = req.params.did; //{pid: p1}
  let difficulty;
  try {
    difficulty = await Difficulty.findById(difficultyId);
  } catch (e) {
   console.log(e)
  }
  res.json({ difficulty: difficulty.toObject({ getters: true }) }); //{id: place} => { place: place}
};

const getDifficulty = async (req, res, next) => {
  let difficulties;
  try {
    difficulties = await Difficulty.find({});
  } catch (e) {

    console.log(e)
  }
  if (!difficulties || difficulties.length === 0) {
    console.log('Could not find difficulties.', 404);
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

    console.log(error)
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
