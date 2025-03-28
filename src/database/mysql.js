import mysql from 'mysql2/promise';
import { logInfo, logError } from '../utils/logger.js';

let connection;

export async function createConnection() {
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME};`);
    await connection.query(`USE ${process.env.DB_NAME};`);

    await createTables();

    logInfo('✅ Connexion MySQL établie et base vérifiée.');
  } catch (err) {
    logError('❌ Erreur de connexion MySQL:', err);
  }
}

async function createTables() {
  await connection.query(`
    CREATE TABLE IF NOT EXISTS guild_config (
      guild_id VARCHAR(255) PRIMARY KEY,
      language VARCHAR(10) DEFAULT 'fr',
      log_channel_id VARCHAR(255)
    );
  `);
}

export function getConnection() {
  return connection;
}
