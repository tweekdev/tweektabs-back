const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const tabsSchema = new Schema({
  chanteur: { type: String, required: true },
  name: { type: String, required: true },
  file: { type: String, required: true },
  link: { type: String },
  instrument: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'Instrument',
  },
  description: { type: String, required: false },
  difficulty: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'Difficulty',
  },
  date: { type: Date, required: true },
  type: { type: mongoose.Types.ObjectId, required: true, ref: 'Type' },
  creator: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
});

module.exports = mongoose.model('Tabs', tabsSchema);
