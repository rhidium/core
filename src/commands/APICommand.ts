import {
  BaseInteraction,
  ContextMenuCommandBuilder,
  SlashCommandBuilder,
} from 'discord.js';
import { BaseCommand, BaseCommandOptions } from './BaseCommand';
import { Module } from '..';

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

export interface APICommandOptions<
  FromModule extends Module | null = null,
  I extends BaseInteraction = BaseInteraction,
>
  extends BaseCommandOptions<FromModule, I> {
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
export class APICommand<
  FromModule extends Module | null = null,
  I extends BaseInteraction = BaseInteraction,
>
  extends BaseCommand<I, FromModule | null>
  implements APICommandOptions<FromModule | null, I>
{
  global: boolean;
  constructor(options: APICommandOptions<FromModule | null, I>) {
    super(options);
    this.global = options.global ?? process.env.NODE_ENV === 'production';
  }
}
