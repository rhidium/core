import { BaseInteraction } from 'discord.js';
import { AvailableGuildInteraction, DMInteraction } from '.';
import { RunFunction } from '..';
import { Client } from '../../client';
import { Module } from '../..';

export type Controller<
  Params extends unknown[] = [],
  ReturnType = void,
> = (...args: [...Params]) => ReturnType;

export type CommandController<
  I extends BaseInteraction,
  AdditionalParams extends unknown[] = [],
> = Controller<
  [...Parameters<RunFunction<I>>, ...AdditionalParams],
  ReturnType<RunFunction<I>>
>;

export type DMCommandController<
  I extends BaseInteraction,
  AdditionalParams extends unknown[] = [],
> = Controller<
  [Client, DMInteraction<I>, ...AdditionalParams],
  ReturnType<RunFunction<I>>
>;

export type GuildCommandController<
  I extends BaseInteraction,
  AdditionalParams extends unknown[] = [],
> = Controller<
  [Client, AvailableGuildInteraction<I>, ...AdditionalParams, ],
  ReturnType<RunFunction<I>>
>;

export type ModuleCommandController<
  I extends BaseInteraction,
  AdditionalParams extends unknown[] = [],
  FromModule extends Module | null = null
> = Controller<
  [...Parameters<RunFunction<I, FromModule>>, ...AdditionalParams],
  ReturnType<RunFunction<I, FromModule>>
>;

export type ModuleDMCommandController<
  I extends BaseInteraction,
  AdditionalParams extends unknown[] = [],
  FromModule extends Module | null = null
> = Controller<
  [Client, DMInteraction<I>, ...AdditionalParams],
  ReturnType<RunFunction<I, FromModule>>
>;

export type ModuleGuildCommandController<
  I extends BaseInteraction,
  AdditionalParams extends unknown[] = [],
  FromModule extends Module | null = null
> = Controller<
  [Client, AvailableGuildInteraction<I>, ...AdditionalParams],
  ReturnType<RunFunction<I, FromModule>>
>;
