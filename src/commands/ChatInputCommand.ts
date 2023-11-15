import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { APICommand, APICommandOptions } from './APICommand';
import { Module } from '..';

export interface ChatInputCommandOptions<
  FromModule extends Module | null = null,
  I extends ChatInputCommandInteraction = ChatInputCommandInteraction,
>
  extends APICommandOptions<FromModule, I> {
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
  FromModule extends Module | null = null,
  I extends ChatInputCommandInteraction = ChatInputCommandInteraction,
>
  extends APICommand<FromModule | null, I>
  implements ChatInputCommandOptions<FromModule | null, I>
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

  constructor(options: ChatInputCommandOptions<FromModule | null, I>) {
    super(options);
    this.data = options.data;
  }
}
