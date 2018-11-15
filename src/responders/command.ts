import { commandTrigger } from '../index';
import { handleDontRemindMessage, handleReminderMessage } from './commands/reminder';
import { Client } from 'irc';


export async function handle(client: Client, channel: string, user: string, message: string) {
    message = message.trim();
    if (!message.startsWith(commandTrigger)) return false;

    const msg = message.slice(commandTrigger.length).split(' ');
    const command = msg.shift();
    const commandMessage = msg.join(' ');

    switch (command) {
      case `remind`:
      case `remindme`:
        handleReminderMessage(client, channel, user, commandMessage);
        return true;
      case `dontremind`:
      case `dontremindme`:
        handleDontRemindMessage(client, channel, user, commandMessage);
        return true;
      case `foo`:
        client.say(channel, `bar`);
        return true;
      default:
        // client.say(to, `${from}, command not found`);
        return false;
    }
}