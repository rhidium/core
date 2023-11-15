import { ButtonInteraction } from 'discord.js';
import { ComponentCommandBase, ComponentCommandOptions, ComponentCommandType } from './ComponentCommandBase';
import { Module } from '..';

/**
 * Represents a command that is executed through a button component
 */
export class ButtonCommand<
  I extends ButtonInteraction = ButtonInteraction,
  FromModule extends Module | null = null
>
  extends ComponentCommandBase<I, FromModule | null>
  implements ComponentCommandOptions<I, FromModule | null>
{
  override type = ComponentCommandType.BUTTON;
  constructor(options: ComponentCommandOptions<I, FromModule | null>) {
    super(options);
  }
}
