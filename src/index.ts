import { Client, Collection, Intents } from 'discord.js';
import 'dotenv/config';
import path from 'path';
import './deploy-commands';
import { filesPaths } from './utils/helpers';

const token = process.env.TOKEN;

// discord client config
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
  partials: [
    'MESSAGE',
    'CHANNEL',
    'REACTION',
    'GUILD_MEMBER',
    'GUILD_SCHEDULED_EVENT',
    'USER',
  ],
});

// add slash commands on client globally
client.commands = new Collection();

// get commands path and files
const commandFiles = filesPaths('commands');
// get each command file and put them in to command collection on client
for (const commandFile of commandFiles) {
  const command = require(commandFile);
  client.commands.set(command.default.data.name, command.default);
}

// get events path and files
const eventsFiles = filesPaths('events');
// get event files and create event listeners
for (const eventsFile of eventsFiles) {
  const { default: event } = require(eventsFile);
  // either once or on
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

client.login(token);
