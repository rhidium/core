import {
  ContextMenuCommandBuilder,
  MessageContextMenuCommandInteraction,
  UserContextMenuCommandInteraction,
} from 'discord.js';
import { APICommand, APICommandOptions } from './APICommand';
import { Module } from '..';

export interface ContextMenuCommandOptions<
  FromModule extends Module | null = null,
  I extends UserContextMenuCommandInteraction = UserContextMenuCommandInteraction,
> extends APICommandOptions<FromModule, I> {
  /** Command data to send off to the Discord API, resolved by builder */
  data?: ContextMenuCommandBuilder;
}

/** Represents a user context-command, right-click user > Apps */
export class UserContextCommand<
  FromModule extends Module | null = null,
  I extends UserContextMenuCommandInteraction = UserContextMenuCommandInteraction,
>
  extends APICommand<FromModule | null, I>
  implements ContextMenuCommandOptions<FromModule | null, I>
{
  override data: ContextMenuCommandBuilder;
  constructor(options: ContextMenuCommandOptions<FromModule | null, I>) {
    super(options);
    this.data = options.data ?? new ContextMenuCommandBuilder();
    this.data.setType(2);
  }
}

export interface MessageContextCommandOptions<
  FromModule extends Module | null = null,
  I extends MessageContextMenuCommandInteraction = MessageContextMenuCommandInteraction,
> extends APICommandOptions<FromModule, I> {
  /** Command data to send off to the Discord API, resolved by builder */
  data?: ContextMenuCommandBuilder;
}

/** Represents a message context-command, right-click message > Apps */
export class MessageContextCommand<
  FromModule extends Module | null = null,
  I extends MessageContextMenuCommandInteraction = MessageContextMenuCommandInteraction,
>
  extends APICommand<FromModule | null, I>
  implements MessageContextCommandOptions<FromModule | null, I>
{
  override data: ContextMenuCommandBuilder;
  constructor(options: MessageContextCommandOptions<FromModule | null, I>) {
    super(options);
    this.data = options.data ?? new ContextMenuCommandBuilder();
    this.data.setType(3);
  }
}
