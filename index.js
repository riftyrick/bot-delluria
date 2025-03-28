import { Client, GatewayIntentBits, Partials, Collection } from 'discord.js';
import { config } from 'dotenv';
import { createConnection } from './src/database/mysql.js';
import { initI18n } from './src/i18n/i18n.js';
import { loadCommands } from './src/handlers/commandHandler.js';
import { loadEvents } from './src/handlers/eventHandler.js';
import { logInfo } from './src/utils/logger.js';

config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ],
  partials: [Partials.Message, Partials.Channel, Partials.GuildMember],
});

client.commands = new Collection();

(async () => {
  await createConnection();
  await initI18n();
  await loadCommands(client);
  await loadEvents(client);

  client.login(process.env.TOKEN);
})();

client.on('ready', () => {
  logInfo(`✅ Connecté en tant que ${client.user.tag}`);
});
