const InstrumentService = require('./instrument.service')


/**
 * Get all instruments
 * @param { Request } req Express Request
 * @param { Response } res Express Response
 * @returns {Promise<void>}
 * @access  Public
 */
exports.getInstruments = async (req, res) => {
    try {
        let instruments = await InstrumentService.getInstruments();
        res.status(201).json({
            instruments: instruments.map((instrument) => instrument.toObject({ getters: true })),
        });
    } catch (error) {
        console.log(error);
        res.status(404).send({
            statusCode: 404,
            message: 'instruments not found',
        });
    }
};


/**
 * Get the last four instruments
 * @param { Request } req Express Request
 * @param { Response } res Express Response
 * @returns {Promise<void>}
 */
exports.getLastFourInstruments = async (req, res) => {
    try {
        let instruments = await InstrumentService.getLastFourInstruments();
        res.status(201).json({
            instruments: instruments.map((instrument) => instrument.toObject({ getters: true })),
        });
    } catch (error) {
        res.status(404).send({
            statusCode: 404,
            message: 'User not found',
        });
    }
};

/**
 * Get instrument by id
 * @param { Request } req Express Request
 * @param { Response } res Express Response
 * @returns {Promise<void>}
 * @access  Public
 */
exports.getInstrumentById = async (req, res) => {
    try {
        let instrument = await InstrumentService.getInstrumentById(req.params.iid);
        res.status(201).json({ instrument: instrument });
    } catch (error) {
        res.status(404).send({
            statusCode: 404,
            message: 'Instrument not found',
        });
    }
};

/**
 * Create instrument
 * @returns {Promise<void>}
 * @access  Private/Admin
 */
exports.createInstrument = async (req, res) => {
    console.log('/create-instrument');
    try {
        let createdInstrument = await InstrumentService.createInstrument(req.body, req.userData);
        res.status(201).json({ instrument: createdInstrument });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

};

/**
 * Update instrument by id
 * @param { Request } req Express Request
 * @param { Response } res Express Response
 * @returns {Promise<void>}
 * @access  Private/Admin
 */
exports.updateInstrument = async (req, res) => {
    console.log('/update-instrument');
    try {
        let updatedInstrument = await InstrumentService.updateInstrument(req.body, req.params.iid);
        res.status(201).json({ instrument: updatedInstrument });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
