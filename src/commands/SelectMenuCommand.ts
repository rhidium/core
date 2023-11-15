import { AnySelectMenuInteraction } from 'discord.js';
import { ComponentCommandBase, ComponentCommandOptions, ComponentCommandType } from './ComponentCommandBase';
import { Module } from '..';

/**
 * Represents a command that is executed through a Select Menu component
 */
export class SelectMenuCommand<
  FromModule extends Module | null = null,
  I extends AnySelectMenuInteraction = AnySelectMenuInteraction,
>
  extends ComponentCommandBase<FromModule | null, I>
  implements ComponentCommandOptions<FromModule | null, I>
{
  override type = ComponentCommandType.SELECT_MENU;
  constructor(options: ComponentCommandOptions<FromModule | null, I>) {
    super(options);
  }
}
