const Discord = require('discord.js');

class Command 
{
    constructor(title, desription, action)
    {
        this.title = title;
        this.desription = desription;
        this.run = action;
    }

    //run(){}
}

module.exports = {Command: Command};