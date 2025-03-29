import { logInfo } from '../utils/logger.js';
import { deployCommands } from '../handlers/deployHandler.js';

export default {
  name: 'ready',
  once: true,
  async execute(client) {
    await deployCommands(client);
    
    logInfo(`🤖 Bot prêt : ${client.user.tag}`);
  }
};
