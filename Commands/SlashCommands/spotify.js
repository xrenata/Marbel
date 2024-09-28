const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const Spotify = require('../../Models/Spotify');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('spotify')
        .setDescription('Get your Spotify data.'),
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction) {
        const userId = interaction.user.id;
        const spotifyData = await Spotify.find({ userId: userId }).sort({ playedAt: -1 });
        if (spotifyData.length === 0) {
            return interaction.reply('No data found for your user ID.');
        }

        const itemsPerPage = 3;
        let currentPage = 0;

        const generateEmbed = (page) => {
            const start = page * itemsPerPage;
            const end = start + itemsPerPage;
            const currentData = spotifyData.slice(start, end);

            return {
                color: 0x1DB954,
                title: 'Your Spotify Data',
                thumbnail: { url: interaction.user.displayAvatarURL({ dynamic: true }) },
                description: currentData.map(data => {
                    return `**${data.trackName}**\nArtist: ${data.artistName}\nAlbum: ${data.albumName}\nDate: <t:${Math.floor(new Date(data.playedAt).getTime() / 1000)}:R>`;
                }).join('\n\n'),
            };
        };
        const updateRow = () => {
            return new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId('prev')
                .setLabel('Previous')
                .setStyle('Secondary')
                .setDisabled(currentPage === 0),
                new ButtonBuilder()
                .setCustomId('page')
                .setLabel(`${currentPage + 1}/${Math.ceil(spotifyData.length / itemsPerPage)}`)
                .setStyle('Secondary')
                .setDisabled(true),
                new ButtonBuilder()
                .setCustomId('next')
                .setLabel('Next')
                .setStyle('Secondary')
                .setDisabled(currentPage >= Math.ceil(spotifyData.length / itemsPerPage) - 1)
            );
        };

        let row = updateRow();
        let msg = await interaction.reply({ embeds: [generateEmbed(currentPage)], components: [row] });

        const filter = i => i.customId === 'prev' || i.customId === 'next';
        const collector = msg.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async i => {
            if (i.customId === 'prev' && currentPage > 0) {
            currentPage--;
            } else if (i.customId === 'next' && currentPage < Math.ceil(spotifyData.length / itemsPerPage) - 1) {
            currentPage++;
            }

            row = updateRow();
            await i.update({ embeds: [generateEmbed(currentPage)], components: [row] });
        });

        collector.on('end', collected => {
            row.components.forEach(button => button.setDisabled(true));
            interaction.editReply({ components: [row] });
        });
    }
};