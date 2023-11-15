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
  FromModule extends Module | null = null,
  AdditionalParams extends unknown[] = [],
> = Controller<
  [...Parameters<RunFunction<FromModule, I>>, ...AdditionalParams],
  ReturnType<RunFunction<FromModule, I>>
>;

export type DMCommandController<
  I extends BaseInteraction,
  FromModule extends Module | null = null,
  AdditionalParams extends unknown[] = [],
> = Controller<
  [Client, DMInteraction<I>, ...AdditionalParams],
  ReturnType<RunFunction<FromModule, I>>
>;

export type GuildCommandController<
  I extends BaseInteraction,
  FromModule extends Module | null = null,
  AdditionalParams extends unknown[] = [],
> = Controller<
  [Client, AvailableGuildInteraction<I>, ...AdditionalParams, ],
  ReturnType<RunFunction<FromModule, I>>
>;
