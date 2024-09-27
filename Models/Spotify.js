const mongoose = require('mongoose');

const SpotifyListeningSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    trackName: {
        type: String,
        required: true
    },
    artistName: {
        type: String,
        required: true
    },
    albumName: {
        type: String,
        required: true
    },
    albumCover: {
        type: String,
        required: true
    },
    playedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('SpotifyListening', SpotifyListeningSchema);