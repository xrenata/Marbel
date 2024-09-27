module.exports = async function ChatInputInteraction(interaction) {
    const command = interaction.client.slashCommands.get(interaction.commandName);

    if (!command) {
        interaction.client.log('error', `No command matching ${interaction.commandName} was found.`);
        return interaction.reply({ content: 'Command not found maybe this is an error.', ephemeral: true })
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        interaction.client.log("error", `Error executing ${interaction.commandName}`);
        console.error(error);
    }
}