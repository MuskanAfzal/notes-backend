const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  original: String,
  summary: String,
  category: String,
});

module.exports = mongoose.model('Note', NoteSchema);