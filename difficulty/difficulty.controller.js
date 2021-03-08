const DifficultyService = require('./difficutlty.service')


/**
 * Get all difficulties
 * @param { Request } req Express Request
 * @param { Response } res Express Response
 * @returns {Promise<void>}
 * @access  Public
 */
exports.getDifficulties = async (req, res) => {
    try {
        let difficulties = await DifficultyService.getDifficulties();
        res.status(201).json({
            difficulties: difficulties.map((difficulty) => difficulty.toObject({ getters: true })),
        });
    } catch (error) {
        console.log(error);
        res.status(404).send({
            statusCode: 404,
            message: 'difficulties not found',
        });
    }
};


/**
 * Get difficulty by id
 * @param { Request } req Express Request
 * @param { Response } res Express Response
 * @returns {Promise<void>}
 * @access  Public
 */
exports.getDifficultyById = async (req, res) => {
    try {
        let difficulty = await DifficultyService.getDifficultyById(req.params.did);
        res.status(201).json({ difficulty: difficulty });
    } catch (error) {
        res.status(404).send({
            statusCode: 404,
            message: 'User not found',
        });
    }
};

/**
 * Create difficulties
 * @returns {Promise<void>}
 * @access  Private/Admin
 */
exports.createDifficulty = async (req, res) => {
    console.log('/create-difficulty');
    try {
        let createdDifficulty = await DifficultyService.createDifficulty(req.body, req.userData);
        res.status(201).json({ difficulty: createdDifficulty });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

};

/**
 * Update difficulty by id
 * @param { Request } req Express Request
 * @param { Response } res Express Response
 * @returns {Promise<void>}
 * @access  Private/Admin
 */
exports.updateDifficulty = async (req, res) => {
    console.log('/update-difficulty');
    try {
        let updatedDifficulty = await DifficultyService.updateDifficulty(req.body, req.params.did);
        res.status(201).json({ difficulty: updatedDifficulty });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
