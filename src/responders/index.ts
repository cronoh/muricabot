import { Client } from 'irc';
import * as command from './command';
import * as keyword from './keyword';
import * as question from './question';


export async function handle(client: Client, channel: string, user: string, message: string) {
  const responders = [
    command,
    keyword,
    question,
  ];

  let handled = false;
  do {
    const responder = responders.shift();
    handled = responder ? await responder.handle(client, channel, user, message) : true;
  } while (!handled && responders.length);
}