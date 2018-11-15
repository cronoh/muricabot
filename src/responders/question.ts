import { botName } from "../index";
import { Client } from "irc";

const randomAnswers = [
  "Absolutely!",
  "Definitely",
  "Probably",
  "Odds too even, needs electoral college",
  "Maybe.  Probably not, but maybe",
  "No.  Just No.",
  "Not a chance"
];

export async function handle(
  client: Client,
  channel: string,
  user: string,
  message: string
) {
  if (message.startsWith(botName) && message.indexOf("?") !== -1) {
    // Response with random answer
    const randomAnswer =
      randomAnswers[Math.floor(Math.random() * randomAnswers.length)];
    client.say(channel, `${user}: ${randomAnswer}`);
    return true;
  }

  return false;
}
