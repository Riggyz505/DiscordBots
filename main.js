const Discord = require('discord.js');
const dictionary = require('./dictionary.js');
const classes = require('./classes.js');
var fs = require('fs');

var commands = new dictionary.Dictionary;
////////////////////////////////////////////////////////////////////////////////////COMMANDS
commands.addKeyValuePair("ping",new classes.Command("ping",": Plays a game of ping-pong." , function(m)
{
    m.reply("Pong!");

    bot.user.setActivity("Playing a game");
    bot.user.setStatus("online");
}));
commands.addKeyValuePair("kill",new classes.Command("kill",": Dusts the bot away." , function(m)
{
    //m.reply("Okay! Mr."+ m.author +" I don't feel too good...");
    m.channel.send("Okay! Mr."+ m.author +" I don't feel too good...");
    
    bot.user.setActivity("Another one bites the dust");
    bot.user.setStatus("dnd");
}));
commands.addKeyValuePair("wake",new classes.Command("wake",": Wakes the bot, can also be called by mentioning the bot." , function(m)
{
    m.reply("Dammit you woke me up!");

    bot.user.setActivity("Pissed that he is awake");
    bot.user.setStatus("online");
}));
commands.addKeyValuePair("help",new classes.Command("help",": Gives the commands and description of all ZeronBot commands." , function(m)
{
    var help = "Here is the list of current commands: \n";

    commands.data().forEach(function(element) 
    {
        help = help + modifier + element.Value.title + element.Value.desription + "\n";
    });

    m.reply(help);

    bot.user.setActivity("Helping the noobs");
    bot.user.setStatus("online");
}));
commands.addKeyValuePair("shout",new classes.Command("shout",' <channel_ID>: Announces the following text, can choose a channel name.' , function(m)
{
    var tempChannelName = m.content.substring(m.content.lastIndexOf("<") + 1, m.content.lastIndexOf(">"));

    console.log(tempChannelName);
    if(tempChannelName.length > 0)
    {
        bot.channels.get(tempChannelName).send(m.content.replace(modifier + "shout", "").replace("<" + tempChannelName + ">",""));
    }
    else
    {
        bot.channels.array().forEach(function(e)
        {
            if(e.type == "text")
            {
                e.send(m.content.replace(modifier + "shout", ""));
            }
        });
    }

    bot.user.setActivity("Enlightening the masses");
    bot.user.setStatus("online");
}));
commands.addKeyValuePair("snap",new classes.Command("snap",': Forcibly purges the bot.' , function(m)
{

    //remove all of the messages by this client
    m.reply("I hope they remember me...");

    bot.user.setActivity("Killed in action");
    bot.user.setStatus("dnd");

    bot.destroy();
}));
commands.addKeyValuePair("ban",new classes.Command("ban",' <use_Mention>: Bans the mentioned user.' , function(m)
{
    var mention = m.mentions.users.first();
    //console.log(mention);

    banList.push(mention);

    m.reply("I have banned " + mention.tag + " to unban simply do zunban <" + mention.tag + ">");

    bot.user.setActivity("Just killed a man");
    bot.user.setStatus("online");
}));
commands.addKeyValuePair("unban",new classes.Command("unban",' <user_Mention>: Unbans the mentioned user.' , function(m)
{
    var mention = m.mentions.users.first();

    banList.splice( banList.indexOf(mention), 1 );

    m.reply("I have freed " + mention.tag + " to ban simply do zban <"+ mention.tag +">");

    bot.user.setActivity("Just saved a man");
    bot.user.setStatus("online");
}));
////////////////////////////////////////////////////////////////////////////////////COMMANDS

//the varaibles
const bot = new Discord.Client();
const modifier = "z";
let banList = [];
//start the bot
bot.login("NTc1Nzk0MzQzNDcwOTU2NTY0.XNNI4g.XqZ-F1c6yoUtyrJZtJ4CU7hK4zw");

//once the bot is ready give us a message and change your status
bot.on('ready', () => 
{
  console.log(`Logged in as ${bot.user.tag}!`);
  bot.user.setActivity("Active and ready");
  //load the json files
  var contents = fs.readFileSync("./banned.json");
  //banlist = [bot.fetchUser("169116410331529216")];
  banList = JSON.parse(contents);

});

bot.on('disconnect', () => 
{
  console.log(`Has saved ban and role data of ${bot.user.tag}!`);
  //save the josn files
  var data = JSON.stringify(banList);
  fs.writeFile("./banned.json", data);
});

//for every message.
bot.on('message', message => 
{
    // && message.author.discriminator != 3731
    if(message.author != bot.user && banList.indexOf(message.author) == -1)
    {
        commands.data().forEach(function(element) 
        {
            if(message.content.toLowerCase().includes(modifier + element.Value.title))//if the text is equal to the key of the command
            {
                //console.log(element.Value.run());
                element.Value.run(message);
            }
        });
      if(message.isMemberMentioned(bot.user))
      {
        commands.findKeyValuePair("wake").run(message);
      }
    }
});


