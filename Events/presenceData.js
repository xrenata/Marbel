const Spotify = require('../Models/Spotify');
const chalk = require('chalk');
module.exports = {
    name: 'presenceUpdate',
    once: false,
    async execute(oldPresence, newPresence) {
        const user = newPresence.user;
        const spotifyActivity = newPresence?.activities?.find(activity => activity.name === 'Spotify');
        const sameActivity = oldPresence?.activities?.find(activity => activity.details) === newPresence.activities.find(activity => activity.details);
        if(sameActivity) return;
        if (spotifyActivity) {
            const lastSpotifyActivity = await Spotify.findOne({ userId: user.id }).sort({ playedAt: -1 });
            const isSameTrack = lastSpotifyActivity &&
                lastSpotifyActivity.trackName === spotifyActivity.details &&
                lastSpotifyActivity.artistName === spotifyActivity.state;

            if (!isSameTrack) {
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
    }
};
