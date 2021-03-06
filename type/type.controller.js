const TypeService = require('./type.service')


/**
 * Get all types
 * @param { Request } req Express Request
 * @param { Response } res Express Response
 * @returns {Promise<void>}
 * @access  Public
 */
exports.getTypes = async (req, res) => {
    try {
        let types = await TypeService.getTypes();
        res.status(201).json({
            types: types.map((type) => type.toObject({ getters: true })),
        });
    } catch (error) {
        console.log(error);
        res.status(404).send({
            statusCode: 404,
            message: 'Types not found',
        });
    }
};


/**
 * Get type by id
 * @param { Request } req Express Request
 * @param { Response } res Express Response
 * @returns {Promise<void>}
 * @access  Public
 */
exports.getTypeById = async (req, res) => {
    try {
        let type = await TypeService.getTypeById(req.params.tid);
        res.status(201).json({ type: type });
    } catch (error) {
        res.status(404).send({
            statusCode: 404,
            message: 'User not found',
        });
    }
};

/**
 * Create Type
 * @returns {Promise<void>}
 * @access  Private/Admin
 */
exports.createType = async (req, res) => {
    console.log('/create-type');
    try {
        let createdType = await TypeService.createType(req.body, req.userData);
        res.status(201).json({ type: createdType });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

};

/**
 * Update type by id
 * @param { Request } req Express Request
 * @param { Response } res Express Response
 * @returns {Promise<void>}
 * @access  Private/Admin
 */
exports.updateType = async (req, res) => {
    console.log('/update-type');
    try {
        let updatedType = await TypeService.updateType(req.body, req.params.tid);
        res.status(201).json({ type: updatedType });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
