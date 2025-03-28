import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function initI18n() {
  await i18next.use(Backend).init({
    fallbackLng: 'fr',
    preload: ['fr', 'en'],
    backend: {
      loadPath: path.join(__dirname, 'locales/{{lng}}.json'),
    }
  });
}
