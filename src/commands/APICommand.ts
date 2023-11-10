import {
  BaseInteraction,
  ContextMenuCommandBuilder,
  SlashCommandBuilder,
} from 'discord.js';
import { BaseCommand, BaseCommandOptions } from './BaseCommand';

// This is the builder variant, not API - temporarily disabled
export type APICommandData =
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
  >
  | ContextMenuCommandBuilder;

export interface APICommandOptions<I extends BaseInteraction>
  extends BaseCommandOptions<I> {
  /**
   * Indicates if this command is available globally. If
   * NODE_ENV is `production` it will default to `true`. If NODE_ENV
   * is anything else, it will default to `false`.
   */
  global?: boolean;
}

/**
 * Represents a Discord API Command, chat-input commands, user- and message-context commands, etc.
 */
export class APICommand<I extends BaseInteraction = BaseInteraction>
  extends BaseCommand<I>
  implements APICommandOptions<I>
{
  global: boolean;
  constructor(options: APICommandOptions<I>) {
    super(options);
    this.global = options.global ?? process.env.NODE_ENV === 'production';
  }
}
