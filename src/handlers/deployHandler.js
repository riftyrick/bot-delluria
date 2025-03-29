import { REST, Routes } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { logInfo, logError } from '../utils/logger.js';

export async function deployCommands(client) {
  const commands = [];
  const commandsPath = path.join('./src/commands');
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    try {
      const { default: command } = await import(`../commands/${file}`);
      if (command?.data) {
        commands.push(command.data.toJSON());
      } else {
        console.warn(`⚠️ Commande sans .data : ${file}`);
      }
    } catch (err) {
      console.error(`❌ Erreur lors du chargement de ${file} :`, err);
    }
  }

  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
  const useGlobal = (process.env.NODE_ENV || '').trim() === 'production';

  try {
    if (useGlobal) {
      logInfo('🌐 Déploiement des commandes globales...');

      // 🔥 Suppression des anciennes commandes globales
      await rest.put(Routes.applicationCommands(client.user.id), { body: [] });
      logInfo('🧽 Commandes globales supprimées');

      await rest.put(Routes.applicationCommands(client.user.id), { body: commands });
      logInfo('✅ Commandes globales enregistrées avec succès !');
    } else {
      logInfo('🏗️ Déploiement DEV sur chaque guilde...');

      for (const guild of client.guilds.cache.values()) {
        // 🔥 Suppression des anciennes commandes de la guilde
        await rest.put(Routes.applicationGuildCommands(client.user.id, guild.id), { body: [] });
        logInfo(`🧽 Commandes supprimées pour : ${guild.name} (${guild.id})`);

        await rest.put(
          Routes.applicationGuildCommands(client.user.id, guild.id),
          { body: commands }
        );
        logInfo(`🔧 Commandes enregistrées pour : ${guild.name} (${guild.id})`);
      }

      logInfo('✅ Toutes les guildes ont reçu les commandes (mode DEV)');
    }
  } catch (err) {
    logError('❌ Erreur lors du déploiement des commandes', err);
  }
}
