const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const Spotify = require('../../Models/Spotify');
const User = require('../../Models/User');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('profile')
        .setDescription('Displays user profile information')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user whose profile you want to view')
                .setRequired(false)
        ),
    
    async execute(interaction) {
        const targetUser = interaction.options.getUser('target') || interaction.user;
        const targetMember = interaction.guild.members.cache.get(targetUser.id);
        const userFetched = await interaction.client.users.fetch(targetUser.id, { force: true });

        const userProfile = await User.findOne({ userId: targetUser.id }) || {};
        const bio = userProfile.bio || 'No bio set.';
        const visibility = userProfile.visibility || 'public';
        const socialLinks = userProfile.links || {};

        if (visibility === 'private' && targetUser.id !== interaction.user.id) {
            return interaction.reply({ content: 'This profile is private.', ephemeral: true });
        }
        let bannerURL = userFetched.bannerURL({ dynamic: true, size: 1024 });

        const spotifyData = await Spotify.find({ userId: targetUser.id }).sort({ playedAt: -1 }).limit(3);
        let spotifyDescription = '  - No recently played songs found.';
        if (spotifyData.length > 0) {
            spotifyDescription = spotifyData.map((data, index) => {
                return `  - [${data.trackName}](${data.albumCover})`;
            }).join('\n');
        }

        let socialLinksDescription = '';
            socialLinksDescription = Object.entries(socialLinks)
                .filter(([platform, url]) => url)
                .map(([platform, url]) => {
                    return url ? `  - [${platform.charAt(0).toUpperCase() + platform.slice(1)}](${url}) ` : `  - [${platform.charAt(0).toUpperCase() + platform.slice(1)}](${url})`;
                })
                .join('\n');


        const embed = new EmbedBuilder()
            .setTitle(`${targetUser.username}'s Profile`)
            .setAuthor({ name: targetUser.tag, iconURL: targetUser.displayAvatarURL({ dynamic: true }) })
            .setColor('Aqua')
            .setDescription(`
- ${targetUser} is a member of this server since <t:${Math.floor(targetMember.joinedAt.getTime() / 1000)}:R> 
and has been on Discord since <t:${Math.floor(targetUser.createdAt.getTime() / 1000)}:R>.
    - Their highest role is ${targetMember.roles.highest}.
    - They have ${targetMember.roles.cache.size} roles.
    - This user has ${targetMember.permissions.toArray().length} permissions.
- Recently played songs:
${spotifyDescription}
  -# This user listened to ${await Spotify.find({ userId: targetUser.id }).countDocuments()} songs on Spotify.
- Biography:
    - ${bio}
- Social Links:
${socialLinksDescription || '  - No social links found.'}
    `)
            .setFooter({ text:`${visibility.charAt(0).toUpperCase() + visibility.slice(1)} user profile.` })
            .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
            .setImage(bannerURL);
        await interaction.reply({ embeds: [embed] });
    },
};
