const { Client, WebhookClient, MessageEmbed, } = require('discord.js-selfbot-v13');
const client = new Client({
    checkUpdate: false,
});
const dotenv = require('dotenv');
dotenv.config();

client.on('ready', () => {
    console.log(`${client.user.tag} has logged in!`)
});

client.on('messageCreate', async (message) => {
    // GuildId is the server where messages are retreived from
    const guildId = client.guilds.cache.get(`${process.env.GUILDID}`);

    // Hook is the webhook used for the discord channel
    const hook = new WebhookClient({ url: `${process.env.WEBHOOK}` });

    if(message.author.id === hook.id) return;

    if(message.guildId == guildId && `${process.env.CHANNELID}`.includes(message.channelId)) {
        var role = JSON.parse(`${process.env.CHANNELNAMES}`)[message.channelId];
        if(message.attachments.size > 0) {
            const attachment = message.attachments.first();
            let content = message.content;
            hook.send({
                content: content,
                files: [attachment.url],
                username: message.author.username,
                avatarURL: message.author.displayAvatarURL(),
            });
            hook.send({ 
                content: role,
                username: message.author.username,
                avatarURL: message.author.avatarURL(),    
            });
        }

        else if(message.embeds.length > 0 && message.interaction != null) {
            hook.send({
                username: message.author.username,
                embeds: [message.embeds[0], new MessageEmbed().setDescription(`This message is an interaction (slash command). \n Command Name: ${message.interaction.commandName} \n Invoked by: ${message.interaction.user.username}#${message.interaction.user.discriminator}`).setColor('RED')],
                avatarURL: message.author.displayAvatarURL(),
                embeds: message.embeds,
            }); 
            hook.send({ 
                content: role,
                username: message.author.username,
                avatarURL: message.author.avatarURL(),    
            });       
        } else if (message.embeds.length > 0) {
            let embedData = message.embeds[0];
            hook.send({ 
                embeds: [embedData],
                username: message.author.username,
                avatarURL: message.author.avatarURL(), 
            });
            hook.send({ 
                content: role,
                username: message.author.username,
                avatarURL: message.author.avatarURL(),    
            });
        } else if (message.interaction != null) {
            hook.send({ 
                content: message.content,
                embeds: [new MessageEmbed().setDescription(`This message is an interaction (slash command). \n Command Name: ${message.interaction.commandName} \n Invoked by: ${message.interaction.user.username}#${message.interaction.user.discriminator}`).setColor('RED')],
                username: message.author.username,
                avatarURL: message.author.avatarURL(), 
            });
            hook.send({ 
                content: role,
                embeds: [new MessageEmbed().setDescription(`This message is an interaction (slash command). \n Command Name: ${message.interaction.commandName} \n Invoked by: ${message.interaction.user.username}#${message.interaction.user.discriminator}`).setColor('RED')],
                username: message.author.username,
                avatarURL: message.author.avatarURL(), 
            });        
        } else {
            let content = message.content
            hook.send({ 
                content: content,
                username: message.author.username,
                avatarURL: message.author.avatarURL(),    
            });
            hook.send({ 
                content: role,
                username: message.author.username,
                avatarURL: message.author.avatarURL(),    
            });
        }
    }
});

client.login(`${process.env.TOKEN}`);