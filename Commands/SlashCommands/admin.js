const { SlashCommandBuilder } = require('discord.js');
const Blacklist = require('../../Models/Blacklist');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('admin')
        .setDescription('Admin commands')
        .addSubcommand(subcommand =>
            subcommand
                .setName('blacklist')
                .setDescription('Blacklist a user')
                .addUserOption(option => 
                    option.setName('target')
                        .setDescription('The user to blacklist')
                        .setRequired(true))
                .addStringOption(option => 
                    option.setName('reason')
                        .setDescription('The reason for blacklisting')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('unblacklist')
                .setDescription('Unblacklist a user')
                .addUserOption(option => 
                    option.setName('target')
                        .setDescription('The user to unblacklist')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('listblacklist')
                .setDescription('List all blacklisted users'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('eval')
                .setDescription('Evaluate JavaScript code')
                .addStringOption(option => 
                    option.setName('code')
                        .setDescription('The code to evaluate')
                        .setRequired(true))),
    async execute(interaction) {
        if (!interaction.client.config.dev.developers.includes(interaction.user.id)) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }
        const subcommand = interaction.options.getSubcommand();
        if (subcommand === 'blacklist') {
            const targetUser = interaction.options.getUser('target');
            const reason = interaction.options.getString('reason');

            try {
                const existingEntry = await Blacklist.findOne({ userId: targetUser.id });
                if (existingEntry) {
                    return interaction.reply(`<@${targetUser.id}> **(${targetUser.username})** is already blacklisted since: <t:${Math.floor(new Date(existingEntry.date).getTime() / 1000)}:D>`);
                }

                const newBlacklistEntry = new Blacklist({
                    userId: targetUser.id,
                    reason: reason
                });

                await newBlacklistEntry.save();

                await interaction.reply(`<@${targetUser.id}> **(${targetUser.username})** has been blacklisted for: **${reason}**`);
                await interaction.client.channels.cache.get(interaction.client.config.dev.blackListLog)?.send({ content: `<@${targetUser.id}> **(${targetUser.username})** has been blacklisted for: **${reason}**` });
            } catch (error) {
                console.error(error);
                await interaction.reply('There was an error while blacklisting the user.');
            }
        } else if (subcommand === 'unblacklist') {
            const targetUser = interaction.options.getUser('target');

            try {
                const existingEntry = await Blacklist.findOne({ userId: targetUser.id });
                if (!existingEntry) {
                    return interaction.reply(`<@${targetUser.id}> **(${targetUser.username})** is not blacklisted.`);
                }

                await Blacklist.deleteOne({ userId: targetUser.id });

                await interaction.reply(`<@${targetUser.id}> **(${targetUser.username})** has been unblacklisted.`);
                await interaction.client.channels.cache.get(interaction.client.config.dev.blackListLog)?.send({ content: `<@${targetUser.id}> **(${targetUser.username})** has been unblacklisted.` });
            } catch (error) {
                console.error(error);
                await interaction.reply('There was an error while unblacklisting the user.');
            }
        } else if (subcommand === 'listblacklist') {
            try {
                const blacklistEntries = await Blacklist.find();
                if (blacklistEntries.length === 0) {
                    return interaction.reply('There are no blacklisted users.');
                }

                const blacklistList = blacklistEntries.map(entry => {
                    const date = new Date(entry.date);
                    return `<@${entry.userId}> - Reason: **${entry.reason}** - Date: <t:${Math.floor(date.getTime() / 1000)}:D>`;
                }).join('\n');

                const embed = {
                    color: 0xff0000,
                    description: blacklistList,
                    author: {
                        name: 'Blacklisted Users',
                        icon_url: interaction.client.user.displayAvatarURL(),
                    },
                };
                await interaction.reply({ embeds: [embed] });
            } catch (error) {
                console.error(error);
                await interaction.reply('There was an error while fetching the blacklist.');
            }
        } else if (subcommand === 'eval') {
            const code = interaction.options.getString('code');
            try {
                let evaled = eval(code);
                if (typeof evaled !== 'string') evaled = require('util').inspect(evaled);
                const embed = {
                    color: 0x3498db,
                    author: {
                        name: 'Evaluation',
                        icon_url: interaction.client.user.displayAvatarURL(),
                    },
                    description: `\`\`\`js\n${evaled.slice(0, 4000)}\n\`\`\``,
                    fields: [
                        {
                            name: 'Input',
                            value: `\`\`\`js\n${code.slice(0, 1000)}\n\`\`\``,
                        },
                    ],
                };
                await interaction.reply({ embeds: [embed] });
            } catch (error) {
                console.error(error);
                await interaction.reply(`\`ERROR\` \`\`\`xl\n${error}\n\`\`\``);
            }
        }
    },
};