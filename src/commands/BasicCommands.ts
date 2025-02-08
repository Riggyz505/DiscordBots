import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'
import { Command } from '../CustomTypes';

const ping: Command = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Pings the bot, just a test command"),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.reply("pong!");
    },
};

const hug: Command = {
    data: new SlashCommandBuilder()
        .setName("hug")
        .setDescription("Relaxing command because hugs are nice"),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.reply(`:hugging: here is a nice big hug ${interaction.user.toString()}`);
    },
};

export { ping, hug };