const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const instrumentSchema = new Schema({
    name: { type: String, required: true },
    creator: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
});

const InstrumentModel = mongoose.model('Instrument', instrumentSchema);
module.exports = InstrumentModel;