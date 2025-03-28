import { readdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function loadEvents(client) {
  const eventFiles = readdirSync(path.join(__dirname, '../events')).filter(file => file.endsWith('.js'));

  for (const file of eventFiles) {
    const event = (await import(`../events/${file}`)).default;
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args));
    } else {
      client.on(event.name, (...args) => event.execute(...args));
    }
  }
}
