const { SlashCommandBuilder, CommandInteraction, EmbedBuilder } = require('discord.js');
const mongoose = require('mongoose');
const Note = require('../../Models/Note');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('note')
        .setDescription('Manage your notes')
        .addSubcommand(subcommand =>
            subcommand
                .setName('create')
                .setDescription('Create a new note')
                .addStringOption(option => 
                    option.setName('content')
                        .setDescription('The content of the note')
                        .setRequired(true))
                .addStringOption(option => 
                    option.setName('date')
                        .setDescription('The date of the note (YYYY-MM-DD)')
                        .setRequired(false)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('delete')
                .setDescription('Delete a note')
                .addStringOption(option => 
                    option.setName('id')
                        .setDescription('The ID of the note to delete')
                        .setRequired(true)
                        .setAutocomplete(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription('List all your notes')),
    
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        const userId = interaction.user.id;

        if (subcommand === 'create') {
            const content = interaction.options.getString('content');
            const date = interaction.options.getString('date');
            const lastNote = await Note.findOne({ userId }).sort({ noteNumber: -1 });
            const noteNumber = lastNote ? lastNote.noteNumber + 1 : 1;

            const note = new Note({
                userId,
                content,
                noteNumber,
                date: date ? new Date(date) : Date.now(),
            });
            await note.save();
            await interaction.reply(`Note created: \`${content}\``);
        } else if (subcommand === 'delete') {
            const id = interaction.options.getString('id');
            const note = await Note.findOne({ userId, noteNumber: id });
            if (note && note.userId === userId) {
                await note.deleteOne();
                await interaction.reply(`Note deleted: ${id}`);
            } else {
                await interaction.reply(`Note not found or you don't have permission to delete it.`);
            }
        } else if (subcommand === 'list') {
            const notes = await Note.find({ userId });
            if (notes.length > 0) {
                const noteList = notes.map(note => {
                    return {
                        name: `Note ${note.noteNumber}`,
                        value: `**Content:** ${note.content}\n**Date:** ${note.date ? `<t:${Math.floor(note.date.getTime() / 1000)}:R>` : 'No date'}`,
                        inline: false
                    };
                });

                const embed = new EmbedBuilder()
                    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
                    .setTitle('Your Notes')
                    .addFields(noteList)
                    .setColor('#5865F2')
                    .setFooter({ text: 'Use /note delete <id> to delete a note' });

                await interaction.reply({ embeds: [embed] });
            } else {
                await interaction.reply('You have no notes.');
            }
        }
    },
};