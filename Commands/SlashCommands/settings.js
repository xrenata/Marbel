const { SlashCommandBuilder } = require('discord.js');
const UserProfile = require('../../Models/User');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('settings')
        .setDescription('Update your profile settings.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('bio')
                .setDescription('Set or update your profile biography.')
                .addStringOption(option => 
                    option.setName('content')
                    .setDescription('Your biography content')
                    .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('visibility')
                .setDescription('Set your profile visibility (public or private).')
                .addStringOption(option => 
                    option.setName('status')
                    .setDescription('Visibility status')
                    .addChoices(
                        { name: 'Public', value: 'public' },
                        { name: 'Private', value: 'private' }
                    )
                    .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('addlink')
                .setDescription('Add a social link to your profile.')
                .addStringOption(option => 
                    option.setName('platform')
                    .setDescription('Choose the platform')
                    .addChoices(
                        { name: 'Twitter', value: 'twitter' },
                        { name: 'Instagram', value: 'instagram' },
                        { name: 'LinkedIn', value: 'linkedin' }
                    )
                    .setRequired(true)
                )
                .addStringOption(option => 
                    option.setName('url')
                    .setDescription('The URL of your profile on the chosen platform')
                    .setRequired(true)
                )
        ),
    /**
     * @param {CommandInteraction} interaction
     */
    async execute(interaction) {
        const userId = interaction.user.id;
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'bio') {
            const bio = interaction.options.getString('content');
            await UserProfile.findOneAndUpdate(
                { userId: userId },
                { bio: bio },
                { upsert: true }
            );
            return interaction.reply(`Your biography has been updated.`);
        }
        if (subcommand === 'visibility') {
            const visibility = interaction.options.getString('status');
            await UserProfile.findOneAndUpdate(
                { userId: userId },
                { visibility: visibility },
                { upsert: true }
            );
            return interaction.reply(`Your profile visibility is now set to **${visibility}**.`);
        }

        if (subcommand === 'addlink') {
            const platform = interaction.options.getString('platform');
            const url = interaction.options.getString('url');

            const userProfile = await UserProfile.findOne({ userId: userId });

            if (!userProfile) {
                await UserProfile.create({
                    userId: userId,
                    links: { [platform]: url }
                });
            } else {
                userProfile.links[platform] = url;
                await userProfile.save();
            }
            return interaction.reply(`Your [${platform}](${url}) link has been added/updated.`);
        }
    }
};
