import { Client } from "irc";

const muricaMessage = `Did someone mention... FREEDOM?! 🇺🇸🇺🇸🇺🇸 ̿'̿'\\̵͇̿̿\\з=( ͠° ͟ʖ ͡°)=ε/̵͇̿̿/'̿̿ ̿ ̿ ̿ ̿ ̿  🇺🇸🇺🇸🇺🇸`;

const keywordList = [
  {
    keywords: ['murica', 'freeedom'],
    responses: [muricaMessage]
  },
];

export async function handle(client: Client, channel: string, user: string, message: string) {
  message = message.toLowerCase(); // Match keywords without case sensitivity

  // Look through keyword list to find a keyword that exists anywhere in the message
  const matchingKeyword = keywordList.find(k => k.keywords.reduce((prev, cur) => prev || message.indexOf(cur) !== -1, false));
  if (matchingKeyword) {
    const randomAnswer = matchingKeyword.responses[Math.floor(Math.random() * matchingKeyword.responses.length)];
    client.say(channel, randomAnswer);

    return true;
  }

  return false;
}