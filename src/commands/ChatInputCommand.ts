import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { APICommand, APICommandOptions } from './APICommand';

export interface ChatInputCommandOptions<
  I extends ChatInputCommandInteraction = ChatInputCommandInteraction,
>
  extends APICommandOptions<I> {
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
>
  extends APICommand<I>
  implements ChatInputCommandOptions<I>
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

  constructor(options: ChatInputCommandOptions<I>) {
    super(options);
    this.data = options.data;
  }
}
