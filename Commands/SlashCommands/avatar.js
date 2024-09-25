const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Get the avatar URL of the selected user, or your own avatar.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user\'s avatar to show')
                .setRequired(false))
        .addStringOption(option => 
            option.setName('format')
                .setDescription('The format of the avatar (png, jpg, gif)')
                .setRequired(false)
                .addChoices(
                    { name: 'png', value: 'png' },
                    { name: 'jpg', value: 'jpg' },
                    { name: 'gif', value: 'gif' }
                )),
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction) {
        const user = interaction.options.getUser('target') || interaction.user;
        const format = interaction.options.getString('format') || 'png';
        const avatarURL = user.displayAvatarURL({ dynamic: true, format: format });

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Avatar')
                    .setStyle('Link')
                    .setURL(avatarURL)
            );
            
        await interaction.reply({ content: avatarURL, components: [row] });
    },
};