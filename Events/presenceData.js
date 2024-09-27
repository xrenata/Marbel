const Spotify = require('../Models/Spotify');
const chalk = require('chalk');
module.exports = {
    name: 'presenceUpdate',
    once: false,
    execute(oldPresence, newPresence) {
        const user = newPresence.user;
        const spotifyActivity = newPresence.activities.find(activity => activity.name === 'Spotify');

        if (spotifyActivity) {
            new Spotify({
                userId: user.id,
                trackName: spotifyActivity.details,
                artistName: spotifyActivity.state,
                albumName: spotifyActivity.assets.largeText,
                albumCover: spotifyActivity.assets.largeImageURL(),
                playedAt: Date.now()
            }).save();
            newPresence.client.log('spotify', `${chalk.blue(user.tag)} is listening to ${chalk.blue(spotifyActivity.details)} by ${chalk.blue(spotifyActivity.state)}`);
        }
    }
};
