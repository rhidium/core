import { ModalSubmitInteraction } from 'discord.js';
import { ComponentCommandBase, ComponentCommandOptions, ComponentCommandType } from './ComponentCommandBase';
import { Module } from '..';

/**
 * Represents a command that is executed through a modal component
 */
export class ModalCommand<
  FromModule extends Module | null = null,
  I extends ModalSubmitInteraction = ModalSubmitInteraction
>
  extends ComponentCommandBase<FromModule, I>
  implements ComponentCommandOptions<FromModule | null, I>
{
  override type = ComponentCommandType.MODAL;
  constructor(options: ComponentCommandOptions<FromModule | null, I>) {
    super(options);
  }
}
