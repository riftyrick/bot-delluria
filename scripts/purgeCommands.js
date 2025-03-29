import { Client, GatewayIntentBits, REST, Routes } from 'discord.js';
import { config } from 'dotenv';

config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

client.once('ready', async () => {
  const clientId = client.user.id;
  console.log(`🤖 Connecté en tant que ${client.user.tag}`);

  // Supprimer commandes globales
  try {
    const globalCommands = await rest.get(Routes.applicationCommands(clientId));
    if (globalCommands.length) {
      console.log(`🌐 Suppression de ${globalCommands.length} commandes globales...`);
      await rest.put(Routes.applicationCommands(clientId), { body: [] });
      console.log(`✅ Commandes globales supprimées.`);
    } else {
      console.log(`✅ Aucune commande globale à supprimer.`);
    }
  } catch (err) {
    console.error('❌ Erreur suppression commandes globales :', err);
  }

  // Supprimer commandes dans chaque guilde
  for (const [guildId, guild] of client.guilds.cache) {
    try {
      const guildCommands = await rest.get(Routes.applicationGuildCommands(clientId, guildId));
      if (guildCommands.length) {
        console.log(`🏠 ${guild.name} (${guildId}) → Suppression de ${guildCommands.length} commandes...`);
        await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] });
        console.log(`✅ Commandes supprimées pour ${guild.name}`);
      } else {
        console.log(`✅ Aucune commande à supprimer pour ${guild.name}`);
      }
    } catch (err) {
      console.error(`❌ Erreur suppression commandes pour ${guild.name} (${guildId}) :`, err);
    }
  }

  console.log('🧹 Purge terminée. Tu peux relancer ton bot proprement.');
  process.exit(0);
});

client.login(process.env.TOKEN);
