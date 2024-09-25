const mongoose = require('mongoose');

async function LoadDatabase(client) {
    try {
        await mongoose.connect(client.config.databaseURL, {/* Options */});
        client.log('info', 'Connected to database');
    } catch (error) {
        client.log('error', 'Error connecting to database');
        throw error;
    }
}
module.exports = LoadDatabase;
