const Discord = require('discord.js');
const client = new Discord.Client();

require('dotenv').config();

client.on('ready', () => {
    console.log('I am ready!');
});

client.on('message', message => {
    if (message.guild !== null || message.author.bot)
        return;

    if (message.content.length === 0 || !message.content.trim()) {
        message.author.send("Please write a message.");
        return;
    }

    try {
        let guildIds = client.guilds.cache.map(guild => guild.id);

        if (!guildIds || guildIds.length !== 1) {
            throw `Number of guilds is ${guildIds.length}`;
        }

        let guild = client.guilds.cache.get(guildIds[0]);

        if (!guild) {
            throw `Couldn't get server`;
        }

        guild.members.fetch(message.author.id)
            .then(() => {
                guild.members.fetch(process.env.CEO_ID)
                    .then((ceo) => {
                        const embed = new Discord.MessageEmbed()
                            .setTitle('Anonymous Message Received')
                            .setDescription(message.content)
                            .setTimestamp();

                        ceo.send(embed);
                        message.author.send("Your anonymous message has been sent.");
                    })
                    .catch((error) => {
                        errorMessage(message.author, `Couldn't get CEO (${error})`)
                    })
            })
            .catch((error) => {
                errorMessage(message.author, `Couldn't get message author (${error})`)
            });
    } catch (error) {
        errorMessage(message.author, error);
    }
});

function errorMessage(receiver, error) {
    receiver.send("Sorry, message could not be sent.");

    let date = new Date();
    console.log(`${date.toUTCString()} - ERROR: ${error}`);
}

client.login(process.env.BOT_TOKEN);