import { SlashCommandBuilder } from 'discord.js';
import { ChatInputCommand, PermLevel } from '../..';
import { moduleListController } from './controllers/list';
import { ModuleConstants } from './enums';
import { moduleInfoController } from './controllers/info';
import {
  ejectModuleSubCommand,
  infoModulesSubCommand,
  listModulesSubCommand,
} from './options';
import { moduleEjectController } from './controllers/eject';

/**
 * Manages plug-and-play modules for your client through
 * a Discord slash command. This command is limited to
 * developers and disabled in production environments.
 * Therefor, is it not localized.
 * 
 * You should import and register `SelectModuleOption` in your auto-completes.
 * 
 * `/src/chat-input/developer/modules.ts`
 * @example
 * ```ts
 * // Name is inferred from the file name
 * import { ModulesCommand } from '@rhidium/core';
 * export default ModulesCommand;
 * ```
 */
export const ModulesCommand = new ChatInputCommand({
  permLevel: PermLevel.Developer,
  disabled: process.env.NODE_ENV === 'production',
  data: new SlashCommandBuilder()
    .setDescription('Manage plug-and-play modules for your client')
    .addSubcommand(listModulesSubCommand)
    .addSubcommand(infoModulesSubCommand)
    .addSubcommand(ejectModuleSubCommand),
  run: async (client, interaction) => {
    const subcommand = interaction.options.getSubcommand();
    if (subcommand === ModuleConstants.LIST_SUBCOMMAND_NAME) moduleListController(client, interaction);
    else if (subcommand === ModuleConstants.INFO_SUBCOMMAND_NAME) moduleInfoController(client, interaction);
    else if (subcommand === ModuleConstants.EJECT_SUBCOMMAND_NAME) moduleEjectController(client, interaction);
  },
});
