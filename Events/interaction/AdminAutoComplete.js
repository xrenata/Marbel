module.exports = async function AdminAutoComplete(interaction) {
    const focusedOption = interaction.options.getFocused(true);

    if (focusedOption.name === 'command') {
        const choices = [
            { name: 'admin', value: 'admin' },
            { name: 'note', value: 'note' },
            { name: 'ping', value: 'ping' },
            { name: 'reload', value: 'reload' },
            { name: 'user', value: 'user' }
        ]
        interaction.respond(
            choices.map(choice => ({ name: choice.name, value: choice.value }))
        )
    }
}