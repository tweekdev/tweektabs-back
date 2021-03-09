const InstrumentModel = require('./instrument.model');

/**
 * Request in database for find all instrument
 * @returns {Promise<[InstrumentModel]>}
 */
exports.getInstruments = async () => {
    try {
        return InstrumentModel.find({});
    } catch (error) {
        throw new Error(error);
    }
};


/**
 * Return the last four instruments
 * @returns {Promise<*>}
 */
exports.getLastFourInstruments = async () => {
    console.log('/last-four');
    try {
        return InstrumentModel.find({})
            .limit(4)
    } catch (e) {
        console.error(e);
    }
};

/**
 * Return the instrument by id
 * @returns {Promise<*>}
 */
exports.getInstrumentById = async (id) => {
    console.log('/instrument-by-id');
    try {
        return InstrumentModel.find({ _id: id });
    } catch (e) {
        throw new Error(e);
    }
};



/**
 * Return instrument after creation
 * @returns {Promise<*>}
 */
exports.createInstrument = async (instrument, userData) => {
    console.log(`/create-instrument-service`);
    let existingDifficulty;
    try {
        existingDifficulty = await InstrumentModel.findOne({ name: instrument.name });
    } catch (e) {
        throw new Error('Cette instrument existe déja.');
    }
    if (existingDifficulty) throw new Error('Cette instrument existe déja.');

    const createdDifficulty = new InstrumentModel({
        name: instrument.name,
        creator: userData.userId,
    });

    try {
        return await createdDifficulty.save();
    } catch (error) {
        throw new Error(error);
    }
};

/**
 * Return instrument after update
 * @returns {Promise<*>}
 */
exports.updateInstrument = async (instrumentData, id) => {
    console.log(`/update-instrument-service`);
    let instrument;
    try {
        instrument = await InstrumentModel.findById(id);
    } catch (e) {
        throw new Error(e);
    }
    instrument.name = instrumentData.name;
    try {
        return await instrument.save();
    } catch (e) {
        throw new Error(e);
    }
}