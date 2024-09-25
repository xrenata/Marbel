const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const chalk = require('chalk');

module.exports = async function LoadCommand(client) {
    await client.slashCommands.clear()
    await client.contextMenus.clear()

    const rest = new REST({ version: '10' }).setToken(client.config.token);

    const data = []

    const slashCommandsPath = path.join(__dirname, '../Commands/SlashCommands');
    const slashCommandFiles = fs.readdirSync(slashCommandsPath).filter(file => file.endsWith('.js'));

    if (slashCommandFiles.length > 0) {
        for (const file of slashCommandFiles) {
            const filePath = path.join(slashCommandsPath, file);
            const command = require(filePath);
            data.push(command.data.toJSON())
            client.slashCommands.set(command.data.name, command);
        }
    }
    const contextMenusPath = path.join(__dirname, '../Commands/ContextMenus');
    const contextMenuFiles = fs.readdirSync(contextMenusPath).filter(file => file.endsWith('.js'));

    if (contextMenuFiles.length > 0) {
        for (const file of contextMenuFiles) {
            const filePath = path.join(contextMenusPath, file);
            const command = require(filePath);
            data.push(command.data.toJSON())
            client.contextMenus.set(command.data.name, command);
        }
    }

    if (data.length > 0) {
        try {
            client.log('info', 'Commands Updated!')
            if (client.config.clientId && !client.config.guildId) {
                await rest.put(
                    Routes.applicationCommands(client.config.clientId),
                    { body: data },
                );
                /* For Delete Guild Commands
                await rest.put(
                    Routes.applicationGuildCommands(client.config.clientId, client.config.guildId),
                    { body: [] },
                );*/
            } else if (client.config.guildId) {
                await rest.put(
                    Routes.applicationCommands(client.config.clientId),
                    { body: [] },
                );
                await rest.put(
                    Routes.applicationGuildCommands(client.config.clientId, client.config.guildId),
                    { body: data },
                );
            }
        } catch (error) {
            client.log('error', 'Cannot Update Commands!')
            console.error(error);
        }
    } else client.log('warning', 'No Commands Found!')
}