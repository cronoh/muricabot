import { Client } from "irc";

let activeReminders: any[] = [];
let reminderID = 0;

export function handleDontRemindMessage(client: Client, channel: string, user: string, message: string) {
  const userReminders = activeReminders.filter(r => r.user === user);
  if (userReminders.length) {
    userReminders.forEach(r => clearTimeout(r.timeout));
    activeReminders = activeReminders.filter(r => r.user !== user);

    client.say(channel, `${user}: Like it never happened`);
  } else {
    client.say(channel, `${user}: You don't have any active reminders`);
  }
}

export function handleReminderMessage(client: Client, channel: string, user: string, message: string) {
  const pieces = message.split(' ');
  const time: any = pieces.shift();
  const reminder = pieces.join(' ');

  const numberValue = parseInt(time);
  if (numberValue <= 0 || numberValue >= 999) {
    return client.say(channel, `${user}: Invalid reminder value.  Examples: 15m, 2h, 120s`);
  }
  let length = 0;
  if (time.indexOf('s') !== -1) {
    length = numberValue * 1000;
  } else if (time.indexOf('m') !== -1) {
    length = numberValue * 60 * 1000;
  } else if (time.indexOf('h') !== -1) {
    length = numberValue * 60 * 60 * 1000;
  } else {
    return client.say(channel, `${user}: Invalid reminder value.  Examples: 15m, 2h, 120s`);
  }

  reminderID++;

  const timeout = setTimeout(() => {
    client.say(channel, `${user}: ${reminder || 'Ping!'} (${time})`);

    activeReminders = activeReminders.filter(r => r.reminderID !== reminderID);
  }, length);

  const newReminder = {
    reminderID,
    channel,
    user,
    length,
    timeout,
  };

  activeReminders.push(newReminder);

  client.say(channel, `${user}: I'll let you know`);
}