import { BaseInteraction } from 'discord.js';
import { BaseCommand, BaseCommandOptions } from './BaseCommand';
import { ButtonCommand, ModalCommand, SelectMenuCommand } from '.';
import { Module } from '..';

export enum ComponentCommandType {
  BUTTON = 900,
  SELECT_MENU = 901,
  MODAL = 902,
}

export type ComponentCommand = ComponentCommandBase | ButtonCommand | ModalCommand | SelectMenuCommand;

export const isComponentCommand = (item: unknown): item is ComponentCommand =>
  item instanceof ComponentCommandBase
  || item instanceof ButtonCommand
  || item instanceof ModalCommand
  || item instanceof SelectMenuCommand;

export interface ComponentCommandOptions<
  FromModule extends Module | null = null,
  I extends BaseInteraction = BaseInteraction,
>
  extends BaseCommandOptions<FromModule, I>,
    ComponentCommandDataOptions {
  /**
   * Indicates if the Component is only usable by the member who initiated it, or everyone that can view the component
   * @default true
   */
  isUserComponent?: boolean;
}

export interface ComponentCommandDataOptions {
  /** The custom ID of the component */
  customId: string;
  type?: ComponentCommandType;
}

/**
 * Represents a command that is executed through a component, a button, modal, select-menu, etc.
 */
export class ComponentCommandBase<
  FromModule extends Module | null = null,
  I extends BaseInteraction = BaseInteraction,
>
  extends BaseCommand<I, FromModule | null>
  implements ComponentCommandOptions<FromModule | null, I>
{
  isUserComponent: boolean;
  customId: string;
  type: ComponentCommandType;
  constructor(options: ComponentCommandOptions<FromModule | null, I>) {
    super(options);
    this.isUserComponent = options.isUserComponent ?? true;
    this.data = { name: options.customId };
    this.customId = options.customId;
    this.type = options.type ?? ComponentCommandType.BUTTON;
  }
}
