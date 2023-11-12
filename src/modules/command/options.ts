import { SlashCommandSubcommandBuilder } from 'discord.js';
import { ModuleConstants } from './enums';
import { SelectModuleOption } from './helpers';

export const listModulesSubCommand = new SlashCommandSubcommandBuilder()
  .setName(ModuleConstants.LIST_SUBCOMMAND_NAME)
  .setDescription('List all modules');

export const infoModulesSubCommand = new SlashCommandSubcommandBuilder()
  .setName(ModuleConstants.INFO_SUBCOMMAND_NAME)
  .setDescription('Get information about how modules work');

export const ejectModuleSubCommand = new SlashCommandSubcommandBuilder()
  .setName(ModuleConstants.EJECT_SUBCOMMAND_NAME)
  .setDescription('Eject an NPM module to your local project')
  .addStringOption(SelectModuleOption.addOptionHandler)
  .addStringOption(option => option
    .setName('path')  
    .setDescription('The path to eject the module to, relative to the project root - must start with "./"')
    .setRequired(false)
  );
