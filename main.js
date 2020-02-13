const Discord = require('discord.js');
const dictionary = require('./dictionary.js');
const classes = require('./classes.js');
var fs = require('fs');
var util = require('util');

var commands = new dictionary.Dictionary;
////////////////////////////////////////////////////////////////////////////////////  COMMANDS
//the fun commands
commands.addKeyValuePair("ping", new classes.Command("ping", false, "Pings the bot, just a test command", function (m) {
    m.channel.send("pong!");

    bot.user.setStatus("online");
}));
commands.addKeyValuePair("hug", new classes.Command("hug", false, "Made for reLax bc the hugs r nice", function (m) {
    m.react('🤗');

    m.channel.send(":hugging: here is a nice big hug <@" + m.author.id + ">");

    bot.user.setStatus("online");
}));
commands.addKeyValuePair("runes", new classes.Command("runes", false, "Speak in the language of the gods", function (m) {
    //m.edit(translateText(false, m.content))
    m.channel.send(translateText(false, m.content));

    bot.user.setStatus("online");
}));  
commands.addKeyValuePair("console", new classes.Command("console", false, "Puts into dev console (testing)", function (m) {
    //m.edit(translateText(false, m.content))
    console.log(m.content)

    bot.user.setStatus("online");
}));  
//the technical commands
commands.addKeyValuePair("help", new classes.Command("help", false, "Gives the commands and description of all ZeronBot commands", function (m) {

    var richText = new Discord.RichEmbed({
        title: "Commands:"
    });
    richText.setColor('AQUA');

    var adminCommands = "```\n";
    var freeCommands = "```\n";

    commands.data().forEach(function (element) {
        if(element.Value.needAdmin)
        {
            adminCommands = adminCommands + modifier + element.Value.title + " - " + element.Value.desription + "\n";
        }
        else
        {
            freeCommands = freeCommands + modifier + element.Value.title + " - " + element.Value.desription + "\n";
        }
    });
    adminCommands = adminCommands + "```";
    freeCommands = freeCommands + "```";

    richText.addField("Everyone",freeCommands,false);
    richText.addField("Admin Only",adminCommands,false);

    m.channel.send(richText);

    bot.user.setStatus("online");
}));
commands.addKeyValuePair("selectchannel", new classes.Command("selectchannel", true, 'chooses the default channel to watch, if none specified will choose the one the command was used in', function (m) {
    //get rid of at just in case
    var c = m.content.replace('<@!575794343470956564>', '');

    watchedChannel = c.substring(c.indexOf("<#") + 2, c.indexOf(">") );

    m.channel.send("The channel has been set to: <#" + watchedChannel + ">");

    bot.user.setStatus("online");
}));
commands.addKeyValuePair("leaderboard", new classes.Command("leaderboard", false, 'Gets the leaderboard for the set channel',async function (m) {
    //get every message
    var history = await getAllMessages([],null);
    //make an array of the ids
    var leaderboard = [];
    outerLoop:
    for(var i = 0; i< history.length; i++)
    {
        for(var j = 0; j< leaderboard.length; j++)
        {
            if(leaderboard[j].id == history[i][1].author.id)
            {
                leaderboard[j] = {id: leaderboard[j].id, messageCount: leaderboard[j].messageCount + 1, messagePerMinute: 0, firstMessage: leaderboard[j].firstMessage, lastMessage: history[i][1]};
                continue outerLoop;
            }
        }
        leaderboard.push({id: history[i][1].author.id, messageCount: 1, messagePerMinute: 0, firstMessage: history[i][1], lastMessage: null})
    }
    //soert the array using a custom method
    leaderboard.sort(function(a,b){
        //neg then a is lower
        if(a.messageCount > b.messageCount)
        {
            return -1;
        }
        else if(a.messageCount < b.messageCount)
        {
            return 1;
        }
        else
        {
            return 0
        }
    });
    //now calculate the messages per minute
    leaderboard.forEach(obj =>{
        var ms = 0;
        if(obj.lastMessage != null)
        {
            ms = obj.firstMessage.createdTimestamp - obj.lastMessage.createdTimestamp;
            var min = ((ms / 1000) / 60);
            obj.messagePerMinute = obj.messageCount / min;
        }
        else
        {
            obj.messagePerMinute = 0;
        }
    });
    //send it into the rich text
    var richText = new Discord.RichEmbed({
        title: "Leaderboard:"
    });
    richText.setColor('PURPLE');
    var topThree = "```\n"
    var bottomFools = "```\n"
    for(var i = 0; i < leaderboard.length; i++)
    {
        if(i <= 2)
        {
            topThree = topThree + "[" + leaderboard[i].messageCount + "] " + (await bot.fetchUser(leaderboard[i].id)).username + " (mpm): " + leaderboard[i].messagePerMinute.toFixed(5) + "\n";
        }
        else
        {
            bottomFools = bottomFools + "[" + leaderboard[i].messageCount + "] " + (await bot.fetchUser(leaderboard[i].id)).username + " (mpm): " + leaderboard[i].messagePerMinute.toFixed(5) + "\n";
        }
    }
    topThree = topThree + "```";
    bottomFools = bottomFools + "```";
    richText.addField("Top 3",topThree,false);
    richText.addField("Next " + (leaderboard.length-3),bottomFools,false);
    m.channel.send(richText);
    //set status
    bot.user.setStatus("online");
}));
commands.addKeyValuePair("rank", new classes.Command("rank", false, "Gives the rank of the author", async function (m) {
    var index = 0;
    //get every message
    var history = await getAllMessages([],null);
    //make an array of the ids
    var leaderboard = [];
    outerLoop:
    for(var i = 0; i< history.length; i++)
    {
        for(var j = 0; j< leaderboard.length; j++)
        {
            if(leaderboard[j].id == history[i][1].author.id)
            {
                leaderboard[j] = {id: leaderboard[j].id, messageCount: leaderboard[j].messageCount + 1, messagePerMinute: 0, firstMessage: leaderboard[j].firstMessage, lastMessage: history[i][1]};
                continue outerLoop;
            }
        }
        leaderboard.push({id: history[i][1].author.id, messageCount: 1, messagePerMinute: 0, firstMessage: history[i][1], lastMessage: null})
    }
    //soert the array using a custom method
    leaderboard.sort(function(a,b){
        //neg then a is lower
        if(a.messageCount > b.messageCount)
        {
            return -1;
        }
        else if(a.messageCount < b.messageCount)
        {
            return 1;
        }
        else
        {
            return 0
        }
    });
    //now calculate the messages per minute
    leaderboard.forEach(obj =>{
        var ms = 0;
        if(obj.lastMessage != null)
        {
            ms = obj.firstMessage.createdTimestamp - obj.lastMessage.createdTimestamp;
            var min = ((ms / 1000) / 60);
            obj.messagePerMinute = obj.messageCount / min;
        }
        else
        {
            obj.messagePerMinute = 0;
        }
        if(obj.id == m.author.id)
        {
            index = leaderboard.indexOf(obj);
        }
    });
    //then print ranks
    //send it into the rich text
    var richText = new Discord.RichEmbed({
        title: "Rank Card"
    });
    richText.setColor("AQUA");
    richText.description = m.author.username + "\n" + "Position: " + (index + 1)  + "\nMessageCount: " + leaderboard[index].messageCount + "\nMessage Per Minute: " + leaderboard[index].messagePerMinute.toFixed(5);
    richText.setThumbnail(m.author.avatarURL)
    m.channel.send(richText);
    //set status
    bot.user.setStatus("online");
}));
commands.addKeyValuePair("data", new classes.Command("data", true, "Gives all the currently saved data in ZeronBot", function (m) {

    var richText = new Discord.RichEmbed({
        title: "Data:"
    });
    richText.setColor('GREEN');

    richText.addField("Current Modifier","`" + modifier + "`",false);

    var currentAdmins = "";
    var currentBanned = "";

    adminList.forEach(function(element){
        currentAdmins = currentAdmins + "`" + element.username + "`" + "\n";
    })

    banList.forEach(function(element){
        currentBanned = currentBanned + "`" + element.username + "`" + "\n";
    })

    richText.addField("Current Admins",(currentAdmins.length == 0) ? "`none`" :currentAdmins,false);
    richText.addField("Current Banned",(currentBanned.length == 0) ? "`none`" :currentBanned,false);

    m.channel.send(richText);

    bot.user.setStatus("online");
}));
commands.addKeyValuePair("modifier", new classes.Command("modifier", true, "Changes the modifier to the given string", function (m) {
    var modNew = m.content;

    modNew = modNew.replace(/<.*</, '').replace(' ', '').replace(modifier + 'modifier','')

    modifier = modNew; //failed rip

    m.channel.send("The modifier has been changed to: " + modifier);
    //check to see if admin

    bot.user.setStatus("online");
}));
commands.addKeyValuePair("kill", new classes.Command("kill", true, 'Destroys the bot - admin use only', function (m) {
    //check to see if admin
    bot.user.setStatus("invisible");

    bot.destroy();
}));
//the administrative commands
commands.addKeyValuePair("admin", new classes.Command("admin", true, '<user_Mention> - Makes the user mentioned admin', function (m) {
    var mentions = m.mentions.users;
    //m.mentions.users.first();

    for (var i = 0; i < mentions.array().length; i++) {
        if (!mentions.array()[i].bot && !isInList(mentions.array()[i], adminList)) {
            adminList.push(mentions.array()[i]);
            m.channel.send(mentions.array()[i].tag + " is now an admin!")
        }
    }
    //m.reply("I have made " + mention.tag + " and admin to undo, type revokeadmin <" + mention.tag + ">");

    bot.user.setStatus("online");
}));
commands.addKeyValuePair("revokeadmin", new classes.Command("revokeadmin", true, '<user_Mention> - Revokes the admin of said user', function (m) {
    var mentions = m.mentions.users;

    for (var i = 0; i < mentions.array().length; i++) {
        if (!mentions.array()[i].bot && isInList(mentions.array()[i], adminList)) {
            adminList.splice(adminList.indexOf(mentions.array()[i]), 1);
            m.channel.send(mentions.array()[i].tag + " has been revoked from admin!")
        }
    }
    //adminList.splice( adminList.indexOf(mention), 1 );
    //m.channel.send("I have fired " + mention.tag + " to undo simply do admin <"+ mention.tag +">");

    bot.user.setStatus("online");
}));
commands.addKeyValuePair("adminlist", new classes.Command("adminlist", false, 'Lists the users that are admins', function (m) {
    var list = "Here is the list of current admins: \n";

    adminList.forEach(function (element) {
        list = list + "<@" + element.id + ">\n";
    });

    m.channel.send(list);

    bot.user.setStatus("online");
}));

commands.addKeyValuePair("ban", new classes.Command("ban", true, '<user_Mention> - Bans the mentioned user', function (m) {
    var mentions = m.mentions.users;

    for (var i = 0; i < mentions.array().length; i++) {
        if (!mentions.array()[i].bot && !isInList(mentions.array()[i], banList)) {
            banList.push(mentions.array()[i]);
            m.channel.send(mentions.array()[i].tag + " has been banned!")
        }
    }
    //banList.push(mention);
    //m.reply("I have banned " + mention.tag + " to unban simply do zunban <" + mention.tag + ">");

    bot.user.setStatus("online");
}));
commands.addKeyValuePair("unban", new classes.Command("unban", true, '<user_Mention> - Unbans the mentioned user', function (m) {
    var mentions = m.mentions.users;
    
    for (var i = 0; i < mentions.array().length; i++) {
        if (!mentions.array()[i].bot && isInList(mentions.array()[i], banList)) {
            banList.splice(banList.indexOf(mentions.array()[i]), 1);
            m.channel.send(mentions.array()[i].tag + " has been freed from jail!")
        }
    }
    //banList.splice( banList.indexOf(mention), 1 );
    //m.channel.send("I have freed " + mention.tag + " to ban simply do zban <"+ mention.tag +">");

    bot.user.setStatus("online");
}));
commands.addKeyValuePair("banlist", new classes.Command("banlist", false, 'Lists the users banned', function (m) {
    var list = "Here is the list of current bans: \n";

    banList.forEach(function (element) {
        list = list + "<@" + element.id + ">\n";
    });

    m.channel.send(list);

    bot.user.setStatus("online");
}));
////////////////////////////////////////////////////////////////////////////////////COMMANDS
async function getAllMessages( arr ,last)
{
    var options = {limit: 100};
    if(last != null)
    {
        options = {limit: 100, before: last[0]};
    }

    return bot.channels.get(watchedChannel).fetchMessages(options).then(function(messages){
        var foo = Array.from(messages)
        arr = arr.concat(foo);

        if(last != null && last[0] == arr[arr.length - 1][0])
        {
            return arr;
        }
        else
        {
            return getAllMessages(arr, arr[arr.length - 1]);
        } 
    }).catch(console.error);   
}


const translateText = (isRunes,text) => {
    //http://xahlee.info/comp/unicode_runic.html
    //the keys
    var runes = ["ᛆ","ᛒ","ᛍ","ᛑ","ᛂ","ᚠ","ᚵ","ᚼ","ᛁ","j","ᚴ","ᛚ","ᛘ","ᚿ","ᚮ","ᛔ","ᛩ","ᚱ","ᛌ","ᛐ","ᚢ","ᚡ","ᚥ","ᛪ","ᛦ","ᛎ"];
    var english = ["a","b","c","d","e","f","g","h","i","j","k","j","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
    //the text
    var product = "";

    if(isRunes)
    {
        //translate back to english
        for(var i =0; i < text.length; i++)
        {
            product = product + ((runes.indexOf(text.charAt(i)) != -1) ? english[runes.indexOf(text.charAt(i))] : text.charAt(i));
        }
    }
    else
    {
        //translate to runes
        for(var i = 0; i < text.length; i++)
        {
            product = product + ((english.indexOf(text.charAt(i)) != -1) ? runes[english.indexOf(text.charAt(i))] : text.charAt(i));
        }
    }

    return product;
}

const isInList = (v, l) => {
    for (var i = 0; i < l.length; i++) {
        if (v.id == l[i].id) {
            return true;
        }
    }
    return false;
}

const getCircularReplacer = () => {
    const seen = new WeakSet();
    return (key, value) => {
        if (typeof value === "object" && value !== null) {
            if (seen.has(value)) {
                return;
            }
            seen.add(value);
        }
        return value;
    };
};

//the varaibles
const bot = new Discord.Client();
var modifier = "z";
var watchedChannel = "";
var banList = [];
var adminList = [];
//start the bot
bot.login("NTc1Nzk0MzQzNDcwOTU2NTY0.XNNI4g.XqZ-F1c6yoUtyrJZtJ4CU7hK4zw");

//once the bot is ready give us a message and change your status
bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.tag}!`);
    bot.user.setActivity("Active and ready");
    //load the json files
    var contents = fs.readFileSync("./banned.json");
    banList = JSON.parse(contents);

    var admins = fs.readFileSync("./admin.json");
    adminList = JSON.parse(admins);

    var data = fs.readFileSync("./data.json");
    dataObject = JSON.parse(data);
    //set the data
    modifier = dataObject.modifier;
    watchedChannel = dataObject.channel;
});

bot.on('disconnect', () => {
    //save the josn files
    var data = JSON.stringify(banList, getCircularReplacer());;
    //var data = util.inspect(banList);
    fs.writeFileSync("./banned.json", data);

    var adminData = JSON.stringify(adminList, getCircularReplacer());;
    //var adminData = util.inspect(adminList);
    fs.writeFileSync("./admin.json", adminData);

    var data = JSON.stringify({modifier: modifier, channel: watchedChannel}, getCircularReplacer());;
    fs.writeFileSync("./data.json", data);

    console.log(`Has saved ban and role data of ${bot.user.tag}!`);
});

//for every message.
bot.on('message', message => {
    if (message.author != bot.user && !isInList(message.author, banList)) //check for bots or banned people
    {
        commands.data().forEach(function (element) {
            //( condition ) ? run this code : run this code instead
            var command = message.content.toLowerCase().substr(0, (message.content.indexOf(" ") == -1) ? message.length : message.content.indexOf(" "));
            if (command == (modifier + element.Value.title)) {
                if (isInList(message.author, adminList)) {
                    element.Value.run(message);
                }
                else if (!element.Value.needAdmin && !isInList(message.author, adminList)) {
                    element.Value.run(message);
                }
                else {
                    message.channel.send("You don't have the permissions to do this!");
                }
            }
            else if (message.isMemberMentioned(bot.user)) {
                var c = message.content.replace('<@!575794343470956564>', '');
                (c.charAt(0) == " ") ? c = c.substr(1, c.length - 1) : c = c;
                var command = c.toLowerCase().substr(0, (c.indexOf(" ") == -1) ? c.length : c.indexOf(" "));
                if (command == element.Value.title) {
                    if (isInList(message.author, adminList)) {
                        element.Value.run(message);
                    }
                    else if (!element.Value.needAdmin && !isInList(message.author, adminList)) {
                        element.Value.run(message);
                    }
                    else {
                       message.channel.send("You don't have the permissions to do this!");
                    }
                }
            }
        });
    }
});


