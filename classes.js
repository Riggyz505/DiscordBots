const Discord = require('discord.js');

class Command 
{
    constructor(title, needAdmin ,desription, action)
    {
        this.title = title;
        this.needAdmin = needAdmin;
        this.desription = desription;
        this.run = action;
    }

    //run(){}
}

module.exports = {Command: Command};