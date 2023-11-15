import { ButtonInteraction } from 'discord.js';
import { ComponentCommandBase, ComponentCommandOptions, ComponentCommandType } from './ComponentCommandBase';
import { Module } from '..';

/**
 * Represents a command that is executed through a button component
 */
export class ButtonCommand<
  FromModule extends Module | null = null,
  I extends ButtonInteraction = ButtonInteraction,
>
  extends ComponentCommandBase<FromModule | null, I>
  implements ComponentCommandOptions<FromModule | null, I>
{
  override type = ComponentCommandType.BUTTON;
  constructor(options: ComponentCommandOptions<FromModule | null, I>) {
    super(options);
  }
}
