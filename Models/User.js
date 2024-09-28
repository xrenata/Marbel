const mongoose = require('mongoose');

const User = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        ref: 'User'
    },
    policyAccepted: {
        type: Boolean,
        required: true,
        default: false
    },
    acceptedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', User);