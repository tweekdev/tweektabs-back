const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');
const userSchema = new Schema({
  firstname: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  pseudo: { type: String, required: true },
  picture: { type: String, required: true },
  password: { type: String, required: true, minLength: 6 },
  role: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Role' }],
  tabs: [{ type: mongoose.Types.ObjectId, required: false, ref: 'Tabs' }],
  tutorials: [
    { type: mongoose.Types.ObjectId, required: false, ref: 'Tutorials' },
  ],
  news: [{ type: mongoose.Types.ObjectId, required: false, ref: 'News' }],
  date_inscription: { type: Date, required: false },
});
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
