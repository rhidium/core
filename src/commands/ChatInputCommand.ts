import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { APICommand, APICommandOptions } from './APICommand';
import { Module } from '..';

export interface ChatInputCommandOptions<
  I extends ChatInputCommandInteraction,
  FromModule extends Module | null = null
>
  extends APICommandOptions<I, FromModule> {
  /** Command data to send off to the Discord API, resolved by builder */
  data:
    | SlashCommandBuilder
    | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>
    | Omit<
      SlashCommandBuilder,
      | 'addBooleanOption'
      | 'addUserOption'
      | 'addChannelOption'
      | 'addRoleOption'
      | 'addAttachmentOption'
      | 'addMentionableOption'
      | 'addStringOption'
      | 'addIntegerOption'
      | 'addNumberOption'
    >;
}

/**
 * Represents a command with chat input, aka: a Slash command (/)
 */
export class ChatInputCommand<
    I extends ChatInputCommandInteraction = ChatInputCommandInteraction,
    FromModule extends Module | null = null
  >
  extends APICommand<I, FromModule | null>
  implements ChatInputCommandOptions<I, FromModule | null>
{
  override data:
    | SlashCommandBuilder
    | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>
    | Omit<
        SlashCommandBuilder,
        | 'addBooleanOption'
        | 'addUserOption'
        | 'addChannelOption'
        | 'addRoleOption'
        | 'addAttachmentOption'
        | 'addMentionableOption'
        | 'addStringOption'
        | 'addIntegerOption'
        | 'addNumberOption'
      >;

  constructor(options: ChatInputCommandOptions<I, FromModule | null>) {
    super(options);
    this.data = options.data;
  }
}
