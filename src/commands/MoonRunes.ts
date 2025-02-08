import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'
import { Command } from '../CustomTypes';

function translateText(isRunes: boolean, text: string) {
    //http://xahlee.info/comp/unicode_runic.html
    //the keys
    var runes = ["ᛆ", "ᛒ", "ᛍ", "ᛑ", "ᛂ", "ᚠ", "ᚵ", "ᚼ", "ᛁ", "j", "ᚴ", "ᛚ", "ᛘ", "ᚿ", "ᚮ", "ᛔ", "ᛩ", "ᚱ", "ᛌ", "ᛐ", "ᚢ", "ᚡ", "ᚥ", "ᛪ", "ᛦ", "ᛎ"];
    var english = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "j", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
    //the text
    var product = "";

    if (isRunes) {
        //translate back to english
        for (var i = 0; i < text.length; i++) {
            product = product + ((runes.indexOf(text.charAt(i)) != -1) ? english[runes.indexOf(text.charAt(i))] : text.charAt(i));
        }
    }
    else {
        //translate to runes
        for (var i = 0; i < text.length; i++) {
            product = product + ((english.indexOf(text.charAt(i)) != -1) ? runes[english.indexOf(text.charAt(i))] : text.charAt(i));
        }
    }

    return product;
}

const runes: Command = {
    data: new SlashCommandBuilder()
        .setName("runes")
        .setDescription("Speak in the language of the gods")
        .addStringOption(option => {
            return option.setName('input')
                .setDescription('The input to translate')
                .setRequired(true)
        }
        ),
    async execute(interaction: ChatInputCommandInteraction) {
        const input = interaction.options.getString('input') ?? "";

        await interaction.reply(translateText(false, input));
    },
};

export { runes };