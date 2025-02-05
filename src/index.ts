import { Client, Events, GatewayIntentBits, REST, Routes } from 'discord.js'
import dotenv from 'dotenv';
import { hug, ping } from './commands/BasicCommands';
import { runes } from './commands/MoonRunes';

dotenv.config();

const bot = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});
const slashCommands = [
    ping,
    hug,
    runes,
];

// once the bot is ready give us a message and change your status
bot.once(Events.ClientReady, readyClient => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);

    readyClient.user.setActivity("Active and ready");
});

bot.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    for (let idx = 0; idx < slashCommands.length; idx++) {
        let command = slashCommands[idx];

        if (interaction.commandName === command.data.name) {
            await command.execute(interaction);
        }
    }
});

// log into discord
bot.login(process.env.DISCORD_BOT_TOKEN);

// make the rest module
const rest = new REST().setToken(process.env.DISCORD_BOT_TOKEN!);


// and deploy your commands!
(async () => {
    try {
        console.log("registering slash commands...");

        await rest.put(
            Routes.applicationCommands(process.env.DISCORD_APPLICATION_ID!),
            { body: slashCommands.map((command) => command.data.toJSON()) },
        );

        console.log("slash commands added!");
    } catch (error) {
        console.log("slash command registration failed with " + error);
    }
})();