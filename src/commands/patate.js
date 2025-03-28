import { SlashCommandBuilder } from 'discord.js';
import { translateCommand } from '../utils/translateCommand.js';
import i18next from 'i18next';

const tMeta = translateCommand('patate');

export default {
  data: new SlashCommandBuilder()
    .setName(tMeta.name)
    .setDescription(tMeta.description)
    .setNameLocalizations(tMeta.nameLocalizations)
    .setDescriptionLocalizations(tMeta.descriptionLocalizations),

  async execute(interaction) {
    const t = i18next.getFixedT(interaction.locale);
    await interaction.reply(t('commands.patate.reply'));
  }
};
