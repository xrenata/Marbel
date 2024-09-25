const mongoose = require('mongoose');

const blacklistSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    date: { type: Date, default: Date.now },
    reason: { type: String, required: true }
});

module.exports = mongoose.model('Blacklist', blacklistSchema);
