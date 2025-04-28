const { SlashCommandBuilder , Routes, PermissionFlagsBits  } = require("discord.js");
const { REST } = require("@discordjs/rest");
const { clientId,  guildId, token } = require('../Config/config.json');

const commands = [
   
    /**
     * EN : define channels for automatic bot's message
     * FR : definit les salons pour les messages automatiques du bot
     * 
     * @param type type of channel
     * @param channel the channel
     */
    new SlashCommandBuilder().setName("define-channel")
        .setDescription('Définir les salons pour les messages du bot')
        .addStringOption(option =>
            option.setName('type')
                .setDescription('Type de salon')
                .addChoices(
                    { name: 'welcome', value: 'welcome' },
                    { name: 'stream', value: 'stream' },
                    { name: 'leave', value: 'leave' },
                    { name: 'admin', value: 'admin' },
                    { name: 'xp', value: 'xp' },
                    { name: 'lolTracker', value: 'lolTracker' }
                )
                .setRequired(true))
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Salon à définir')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    ,
]
    .map(command => command.toJSON());

const rest = new REST({ version: "10"}).setToken(token);

rest.put(Routes.applicationCommands(clientId), { body : commands})
    .then((data) => console.log(`Succesfully registered ${data.length} application commands. `))
    .catch(console.error);