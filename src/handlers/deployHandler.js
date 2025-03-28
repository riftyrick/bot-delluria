import { REST, Routes } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { logInfo, logError } from '../utils/logger.js';

export async function deployCommands(client) {
  const commands = [];
  const commandsPath = path.join('./src/commands');
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const { default: command } = await import(`../commands/${file}`);
    if (command?.data) {
      commands.push(command.data.toJSON());
    }
  }

  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
  const useGlobal = process.env.NODE_ENV === 'production';

  try {
    if (useGlobal) {
      logInfo('🌐 Déploiement des commandes globales...');
      await rest.put(Routes.applicationCommands(client.user.id), { body: commands });
      logInfo('✅ Commandes globales enregistrées avec succès !');
    } else {
      logInfo('🏗️ Déploiement DEV sur chaque guilde...');

      for (const guild of client.guilds.cache.values()) {
        await rest.put(
          Routes.applicationGuildCommands(client.user.id, guild.id),
          { body: commands }
        );
        logInfo(`🔧 Commandes enregistrées pour la guilde : ${guild.name} (${guild.id})`);
      }

      logInfo('✅ Toutes les guildes ont reçu les commandes (mode DEV)');
    }
  } catch (err) {
    logError('❌ Erreur lors du déploiement des commandes', err);
  }
}
