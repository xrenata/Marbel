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
        const embed = new EmbedBuilder()
        .setTitle('User Profile')
        .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL({ dynamic: true }) })
        .setColor('Aqua')
        .setDescription(`${user.tag} is a member of this server since ${member.joinedAt}
            and has been on Discord since ${user.createdAt}.
            Their highest role is ${member.roles.highest}.
            They have ${member.roles.cache.size} roles.
            This user has ${member.permissions.toArray().length} permissions.
            This user listen to ${await Spotify.find({userId: user.id}).countDocuments()} songs on Spotify.`)
        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
        .setImage(bannerURL || 'https://t4.ftcdn.net/jpg/04/28/76/95/360_F_428769564_NB2T4JM9E2xsxFdXXwqW717HwgaZdpAq.jpg')
        await interaction.reply({ embeds: [embed] });
    },
};