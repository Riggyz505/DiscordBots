import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder } from 'discord.js'

export type Command = {
    data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder,
    execute(interaction: ChatInputCommandInteraction): Promise<void>
}

export type ServerInfo = {
    status: string,
    online: boolean,
    players: {
        max: number,
        now: number
    }
}

export type ServerConfig = {
    name: string, 
    ip: string,
    port?: number,
    playerCount?: number
}