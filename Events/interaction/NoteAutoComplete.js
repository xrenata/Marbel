const Note = require('../../Models/Note');

module.exports = async function NoteInteraction(interaction) {
    const focusedOption = interaction.options.getFocused(true);
    const userId = interaction.user.id;

    if (focusedOption.name === 'id') {
        const notes = await Note.find({ userId });
        const choices = notes.map(note => ({
            name: `${note.noteNumber} - ${note.content} - (${note.date ? note.date.toISOString().split('T')[0] : 'No date'})`,
            value: note.noteNumber.toString()
        }));

        await interaction.respond(
            choices.map(choice => ({ name: choice.name, value: choice.value }))
        );
    }
}