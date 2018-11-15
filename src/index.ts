
require('dotenv').load();

import * as responders from './responders';
import * as irc from 'irc';

export const userName: string = process.env.IRC_USERNAME || 'muricaBot';
export const botName: string = process.env.IRC_NICKNAME || 'muricaBot';
export const commandTrigger: string = process.env.BOT_COMMAND_TRIGGER || `.`;

const client = new irc.Client(process.env.IRC_NETWORK || 'irc.freenode.net', userName, {
    userName: userName,
    realName: 'MURICA Bot v1',
    floodProtection: true,
    floodProtectionDelay: 500,
});

const channels: string[] = process.env.IRC_CHANNELS ? process.env.IRC_CHANNELS.split(',') : ['#laravel-offtopic', '#laravel'];
const botChannels: string[] = process.env.BOT_CHANNELS ? process.env.BOT_CHANNELS.split(',') : ['#laravel-offtopic'];

client.addListener('message', async (user: string, channel: string, message: string) => {
    console.log(user + ' => ' + channel + ': ' + message);

    if (botChannels.indexOf(channel) === -1) return; // Don't care about this channel

    await responders.handle(client, channel, user, message);
});

client.addListener('raw', (message: any) => {
    console.log(message);
    if (message.nick === 'NickServ') {
        if (message.args && message.args[1] && message.args[1].indexOf('You are now identified') !== -1) {
            // Wait to be authenticated before we join channels (+r)
            bootCommands();
        }
    }
});

client.addListener('registered', (msg: any) => {
    console.log(`Connected to server!`, msg);
    setTimeout(() => {
        console.log(`Sending identify command to NickServ....`);
        client.say('nickserv', `identify ${process.env.IRC_PASSWORD}`);

        // These can be used to register new users with the network and verify them to join +r channels
        // client.say('nickserv', 'register password email@address.com');
        // client.say('nickserv', 'verify register userName verify-code-from-email');
        // client.say('nickserv', 'identify REGISTER userName another-verify-code');
    }, 10000);
});

client.addListener('error', (err: any) => {
    console.log(`'Err', `, err);
});

function bootCommands() {
    if (botName !== userName) {
        client.send('nick', botName);
    }

    channels.forEach(channel => client.join(channel, console.log));
}