const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const Spotify = require('../../Models/Spotify');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('profile')
        .setDescription('Displays user profile information'),
    async execute(interaction) {
        const user = interaction.user;
        const member = interaction.guild.members.cache.get(user.id);
        const userFetched = await interaction.client.users.fetch(user.id, { force: true });
        let bannerURL = userFetched.bannerURL({ dynamic: true , size: 1024 });
        if (!bannerURL) {
            bannerURL = interaction.guild.bannerURL()
        }
        const spotifyData = await Spotify.find({ userId: user.id }).sort({ playedAt: -1 }).limit(3);
        let spotifyDescription = 'No recently played songs found.';

        if (spotifyData.length > 0) {
            spotifyDescription = spotifyData.map((data, index) => {
                return `  - [${data.trackName}](${data.albumCover})`;
            }).join('\n');
        }
        const embed = new EmbedBuilder()
        .setTitle('User Profile')
        .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL({ dynamic: true }) })
        .setColor('Aqua')
        .setDescription(`
- ${user} is a member of this server since <t:${Math.floor(member.joinedAt.getTime() / 1000)}:R>
and has been on Discord since <t:${Math.floor(user.createdAt.getTime() / 1000)}:R>.
    - Their highest role is ${member.roles.highest}.
    - They have ${member.roles.cache.size} roles.
    - This user has ${member.permissions.toArray().length} permissions.
- Recently played songs:
${spotifyDescription}
-# This user listened to ${await Spotify.find({ userId: user.id }).countDocuments()} songs on Spotify.
    `)
        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
        .setImage(bannerURL);
        await interaction.reply({ embeds: [embed] });
    },
};