import {
  ContextMenuCommandBuilder,
  MessageContextMenuCommandInteraction,
  UserContextMenuCommandInteraction,
} from 'discord.js';
import { APICommand, APICommandOptions } from './APICommand';
import { Module } from '..';

export interface ContextMenuCommandOptions<
  I extends UserContextMenuCommandInteraction,
  FromModule extends Module | null = null,
> extends APICommandOptions<I, FromModule> {
  /** Command data to send off to the Discord API, resolved by builder */
  data?: ContextMenuCommandBuilder;
}

/** Represents a user context-command, right-click user > Apps */
export class UserContextCommand<
    I extends
      UserContextMenuCommandInteraction = UserContextMenuCommandInteraction,
    FromModule extends Module | null = null,
  >
  extends APICommand<I, FromModule | null>
  implements ContextMenuCommandOptions<I, FromModule | null>
{
  override data: ContextMenuCommandBuilder;
  constructor(options: ContextMenuCommandOptions<I, FromModule | null>) {
    super(options);
    this.data = options.data ?? new ContextMenuCommandBuilder();
    this.data.setType(2);
  }
}

export interface MessageContextCommandOptions<
  I extends MessageContextMenuCommandInteraction,
  FromModule extends Module | null = null,
> extends APICommandOptions<I, FromModule> {
  /** Command data to send off to the Discord API, resolved by builder */
  data?: ContextMenuCommandBuilder;
}

/** Represents a message context-command, right-click message > Apps */
export class MessageContextCommand<
    I extends
      MessageContextMenuCommandInteraction = MessageContextMenuCommandInteraction,
    FromModule extends Module | null = null,
  >
  extends APICommand<I, FromModule | null>
  implements MessageContextCommandOptions<I, FromModule | null>
{
  override data: ContextMenuCommandBuilder;
  constructor(options: MessageContextCommandOptions<I, FromModule | null>) {
    super(options);
    this.data = options.data ?? new ContextMenuCommandBuilder();
    this.data.setType(3);
  }
}
