const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('banner')
        .setDescription('Get the banner URL of the selected user, or your own banner.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user\'s banner to show')
                .setRequired(false))
        .addStringOption(option => 
            option.setName('format')
                .setDescription('The format of the banner (png, jpg, gif)')
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
        
        const userFetched = await interaction.client.users.fetch(user.id, { force: true });
        const bannerURL = userFetched.bannerURL({ dynamic: true, format: format, size: 1024 });

        if (!bannerURL) {
            return interaction.reply({ content: 'This user does not have a banner.', ephemeral: true });
        }

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Banner')
                    .setStyle('Link')
                    .setURL(bannerURL)
            );
            
        await interaction.reply({ content: bannerURL, components: [row] });
    },
};