const DifficultyModel = require('./difficulty.model');

/**
 * Request in database for find all difficulties
 * @returns {Promise<[DifficultyModel]>}
 */
exports.getDifficulties = async () => {
    try {
        return DifficultyModel.find({});
    } catch (error) {
        console.error(error);
    }
};

/**
 * Return the difficulty by id
 * @returns {Promise<*>}
 */
exports.getDifficultyById = async (id) => {
    console.log('/difficulty-by-id');
    try {
        return DifficultyModel.find({ _id: id });
    } catch (e) {
        throw new Error(e);
    }
};



/**
 * Return Difficulty after creation
 * @returns {Promise<*>}
 */
exports.createDifficulty = async (difficulty, userData) => {
    console.log(`/create-difficulty-service`);
    let existingDifficulty;
    try {
        existingDifficulty = await DifficultyModel.findOne({ name: difficulty.name });
    } catch (e) {
        throw new Error('Ce difficulty existe déja.');
    }
    if (existingDifficulty) throw new Error('Ce difficulty existe déja.');

    const createdDifficulty = new DifficultyModel({
        name: difficulty.name,
        creator: userData.userId,
    });

    try {
        return await createdDifficulty.save();
    } catch (error) {
        throw new Error(e);
    }
};

/**
 * Return fiddiculty after update
 * @returns {Promise<*>}
 */
exports.updateDifficulty = async (difficultyData, id) => {
    console.log(`/update-difficulty-service`);
    let difficulty;
    try {
        difficulty = await DifficultyModel.findById(id);
    } catch (e) {
        throw new Error("Une erreur c'est produite.");
    }
    difficulty.name = difficultyData.name;
    try {
        return await type.save();
    } catch (e) {
        throw new Error("Une erreur c'est produite.");
    }
}