const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const typeSchema = new Schema({
    name: { type: String, required: true },
    creator: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
});

const TypeModel = mongoose.model('Type', typeSchema);
module.exports = TypeModel;