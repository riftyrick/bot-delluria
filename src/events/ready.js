import { logInfo } from '../utils/logger.js';
import { deployCommands } from '../handlers/deployHandler.js';

export default {
  name: 'ready',
  once: true,
  async execute(client) {
    logInfo(`🤖 Bot prêt : ${client.user.tag}`);

    if (process.env.NODE_ENV !== 'production') {
      await deployCommands(client);
    }
  }
};
