const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../Models/User');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('policy')
        .setDescription('Accept the policy'),

    /**
     * Executes the policy accept command.
     * @param {CommandInteraction} interaction
     */
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Policy Acceptance')
            .setDescription('By accepting this policy, you agree to allow us to monitor your Spotify data, which will be publicly available.');

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('accept_policy')
                    .setLabel('Accept')
                    .setStyle('Success'),
            );

        await interaction.reply({ embeds: [embed], components: [row] });

        const filter = i => i.customId === 'accept_policy' && i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 24000 });

        collector.on('collect', async i => {
            if (i.customId === 'accept_policy') {
                User.create({ 
                    userId: interaction.user.id,
                    policyAccepted: true,
                    acceptedAt: new Date(),
                 });
                await i.update({ content: 'You have accepted the policy.', embeds: [] ,components: [] });
            }
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                interaction.editReply({ content: 'You did not accept the policy in time.', embeds: [] ,components: [] });
            }
        });
    },
};