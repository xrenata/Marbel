const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    noteNumber: Number,
    userId: String,
    content: String,
    date: { type: Date, default: Date.now() },
    important: { type: Boolean, default: false },
    updatedAt: { type: Date, default: Date.now }
});

noteSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Note', noteSchema);