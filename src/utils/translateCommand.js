import i18next from 'i18next';

export function translateCommand(key) {
  const fallbackLang = 'en';
  const supportedLangs = ['fr', 'en'];
  const namespace = 'translation'; // par défaut

  const localeMap = {
    fr: 'fr',
    en: 'en-US'
  };

  const getSafe = (lang, k) => {
    const value = i18next.getResource(lang, namespace, `commands.${key}.${k}`);
    if (!value) {
      console.warn(`[translateCommand] ⚠️ Clé manquante: ${lang}:${namespace}:commands.${key}.${k}`);
    }
    return value || (k === 'name' ? key : '...');
  };

  const name = getSafe(fallbackLang, 'name');
  const description = getSafe(fallbackLang, 'description');

  const nameLocalizations = {};
  const descriptionLocalizations = {};

  for (const lang of supportedLangs) {
    const discordLocale = localeMap[lang];
    const nameLoc = i18next.getResource(lang, namespace, `commands.${key}.name`);
    const descLoc = i18next.getResource(lang, namespace, `commands.${key}.description`);
    if (nameLoc && discordLocale) nameLocalizations[discordLocale] = nameLoc;
    if (descLoc && discordLocale) descriptionLocalizations[discordLocale] = descLoc;
  }

  return { name, description, nameLocalizations, descriptionLocalizations };
}
