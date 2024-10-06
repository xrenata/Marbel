const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction } = require('discord.js');
const mongoose = require('mongoose');
const moment = require('moment');
const os = require('os');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('Get the bot\'s statistics.'),
    /**
     * @param {CommandInteraction} interaction
     */
    async execute(interaction) {
        const wsPing = interaction.client.ws.ping;
        const date = new Date();
        const mongoPing = await mongoose.connection.db.admin().ping();
        const mongoPingTime = mongoPing.ok ? '**Operational**' : '**Not Operational**';
        const uptimeHumanized = moment.duration(os.uptime() * 1000).humanize();

        const embed = {
            color: 0x0099ff,
            footer: {
                text: interaction.client.user.username,
                icon_url: interaction.client.user.displayAvatarURL({ dynamic: true }),
            },
            description: `
- Bot
  - WebSocket Ping: **${wsPing}ms**
  - Database Status: ${mongoPingTime}
  - Message Latency: **${Date.now() - interaction.createdTimestamp}ms**
  - Servers Count: **${interaction.client.guilds.cache.size}**
  - Users Count: **${interaction.client.users.cache.size}**
- Server
  - Arch: **${os.arch()}**
  - OS: **${os.type()} ${os.release()}**
- CPU
  - Model: **${os.cpus()[0].model}**
  - CPU Usage: **${Math.round(process.cpuUsage().system / 8096)}%**
  - Uptime: **${uptimeHumanized}**
- Memory
  - Total: **${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB**
  - Free: **${(os.freemem() / 1024 / 1024 / 1024).toFixed(2)} GB**
- Versions
  - Node.js Version: **${process.version}**
  - Discord.js Version: **${require('discord.js').version}**
  - MongoDB Version: **${require('mongoose').version}**
            `,
        };
        let mongo_lacenty = Date.now();

        let mongo_status = await date - mongo_lacenty;
        console.log (mongo_status);

        await interaction.reply({ embeds: [embed] });
    },
};