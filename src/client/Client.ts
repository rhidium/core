import {
  BaseInteraction,
  Client as DiscordClient,
  ClientOptions as DiscordClientOptions,
  EmbedData,
  Events,
  If,
  LocaleString,
  version as discordJsVersion,
} from 'discord.js';

import {
  ChatInputCommand,
  MessageContextCommand,
  ModalCommand,
  UserContextCommand,
} from '../commands';

import {
  CommandThrottle,
  CommandThrottleOptions,
} from '../commands/Cooldown';

import { IEmojis, UserColors } from './config';
import { Logger, LoggerOptions } from '../logger/console';
import { CommandManager, CommandManagerCommandsOptions } from '../managers';
import { ClientPermissionOptions, ClientPermissions } from '../permissions';
import { ClusterClient } from 'discord-hybrid-sharding';
import { Embeds } from '.';
import pkg from '../../package.json';
import { DiscordLogger } from '../logger/discord';
import { FileLoggerOptions } from '../logger';
import { Constants } from '../constants';
import { ClientJobManager } from '../jobs';
import { default as I18N, i18n } from 'i18next';
import {
  CommandMiddleware,
  CommandMiddlewareContext,
  CommandMiddlewareMetaContext,
  CommandMiddlewareOptions,
  Directories,
  InteractionUtils,
  Module,
  officialModules,
} from '..';
import Lang from '../i18n/i18n';

export type ClientWithCluster<Ready extends boolean = boolean> = Client<Ready> & {
  cluster: ClusterClient<Client>
};

export interface ClientInitializationOptions {
  commandDirPath: Directories;
}

export interface ClientDebugOptions {
  enabled: boolean;
  commandData: boolean;
}

export type GlobalMiddlewareOptions = CommandMiddlewareOptions<
  BaseInteraction,
  CommandMiddlewareContext<BaseInteraction>
>

export type GlobalMiddleware = CommandMiddleware<BaseInteraction, CommandMiddlewareContext<BaseInteraction>>

/** Additional custom client options */
export interface ClientOptions {
  /** Additional debug options */
  debug: ClientDebugOptions;
  /** Whether to suppress the vanity print to console */
  suppressVanity: boolean;
  errorChannelId?: string | null;
  commandUsageChannelId?: string | null;
  /**
   * The default command cooldown for all commands - default
   * config is 2 usages per 5 seconds - short burst protection
   */
  defaultCommandThrottling: CommandThrottleOptions;
  /** Custom permissions for the client */
  internalPermissions: ClientPermissionOptions;
  /**
   * Should we refuse, and reply to, interactions that belong to unknown commands
   * @default false
   */
  refuseUnknownCommandInteractions: boolean;
  /**
   * Should we print information on unknown command interactions,
   * you should enable this if you run multiple processes/clients
   * on the same bot user
   * @default true
   */
  suppressUnknownInteractionWarning: boolean;
  /** The id to register development commands to */
  developmentServerId?: string | undefined;
  logging?: Omit<LoggerOptions & FileLoggerOptions, 'client'>;
  I18N?: i18n;
  locales?: LocaleString[];
  pkg?: Record<string, unknown>;
  extensions?: Record<string, unknown>;
  globalMiddleware?: GlobalMiddlewareOptions;
  modules?: Module[];
}

export interface RequiredClientOptions<Ready extends boolean = boolean> {
  /** Discord bot token */
  token: If<Ready, string, string | null>
  /** The bot's Discord user id/application id */
  applicationId: string;
  directories: CommandManagerCommandsOptions;
  /** Customize colors for the client */
  colors: UserColors;
  /** Customize emojis for the client */
  emojis: IEmojis;
}

export class Client<Ready extends boolean = boolean> extends DiscordClient<Ready> {
  cluster: ClusterClient<Client<Ready>> | null = null;
  readonly startInitializeTs = process.hrtime();
  readonly colors: UserColors;
  readonly embeds: Embeds;
  readonly clientEmojis: IEmojis;
  directories: CommandManagerCommandsOptions;
  readonly extendedOptions: DiscordClientOptions &
    Partial<ClientOptions> &
    RequiredClientOptions<Ready>;
  readonly debug: ClientDebugOptions;
  readonly logger: Logger;
  readonly applicationId: string;
  readonly commandManager = new CommandManager({
    client: this,
  });
  readonly defaultCommandThrottling: CommandThrottle;
  readonly internalPermissions: ClientPermissions;
  jobManager: ClientJobManager | null = null;
  I18N: i18n;
  locales: LocaleString[];
  pkg: Record<string, unknown> = pkg;
  extensions: Record<string, unknown> = {};
  globalMiddleware: GlobalMiddleware;
  modules: Module[];

  constructor(
    /** Your discord.js client - doesn't have to be logged in or initialized */
    options: DiscordClientOptions &
      Partial<ClientOptions> &
      RequiredClientOptions<Ready>,
  ) {
    super(options);
    this.extendedOptions = options;
    this.directories = options.directories;
    const { debug } = options;
    this.debug = {
      enabled: debug?.enabled ?? false,
      commandData: debug?.commandData ?? false,
    };
    this.token = options.token;
    this.modules = options.modules ?? [];
    this.applicationId = options.applicationId;
    this.defaultCommandThrottling = new CommandThrottle(
      options.defaultCommandThrottling ?? {},
    );
    this.internalPermissions = new ClientPermissions(
      options.internalPermissions ?? {},
    );
    this.logger = new Logger({
      client: this,
      combinedLogging: options.logging?.combinedLogging ?? true,
    });
    this.extensions = options.extensions ?? {};
    this.colors = {
      debug: options.colors.debug,
      error: options.colors.error,
      info: options.colors.info,
      primary: options.colors.primary,
      secondary: options.colors.secondary,
      success: options.colors.success,
      warning: options.colors.warning,
      waiting: options.colors.waiting,
    };
    this.clientEmojis = {
      success: options.emojis.success,
      error: options.emojis.error,
      info: options.emojis.info,
      warning: options.emojis.warning,
      debug: options.emojis.debug,
      waiting: options.emojis.waiting,
      separator: options.emojis.separator,
    };

    this.globalMiddleware = new CommandMiddleware(options.globalMiddleware ?? {});
    this.pkg = options.pkg ?? pkg;
    const verStr = this.pkg.version ? ` ${this.clientEmojis.separator} v${this.pkg.version}` : '';
    const clientBrandingOptions: EmbedData = {
      footer: {
        text: `${this.pkg.name ?? 'Discord Bot'}${verStr}`,
      },
    };
    this.embeds = new Embeds({
      colors: this.colors,
      brandingOptions: clientBrandingOptions,
      emojis: this.clientEmojis,
    });

    this.I18N = options.I18N ?? I18N;
    this.locales = options.locales ?? ['en-US'];

    // Initialize the client
    this.initialize();
  }

  printVanity = () => {
    if (this.extendedOptions.suppressVanity) return;
    const author = this.pkg.author && typeof this.pkg.author === 'object' && 'name' in this.pkg.author
      ? this.pkg.author.name
      : this.pkg.author ?? 'Unknown';
    this.logger.info([
      '',
      '--------------------------------------------------------',
      `${this.pkg.name} by ${author}`,
      '--------------------------------------------------------',
      `Version: v${this.pkg.version ?? 'Unknown'}`,
      `Node.js version: ${process.version}`,
      `Discord.js version: ${discordJsVersion}`,
      `Licensing: ${this.pkg.license ?? 'Unknown'}`,
      '--------------------------------------------------------',
    ].join('\n'));
  };

  initialize(): this {
    this.printVanity();
    this.loadModules();

    const moduleDirectories = this.modules.map((module) => module.directories);
    const mergedDirectories: CommandManagerCommandsOptions = {
      chatInputs: moduleDirectories.map((dir) => dir.chatInputs)
        .flat().concat(...(this.directories.chatInputs ?? [])),
      autoCompletes: moduleDirectories.map((dir) => dir.autoCompletes)
        .flat().concat(...(this.directories.autoCompletes ?? [])),
      componentCommands: moduleDirectories.map((dir) => dir.componentCommands)
        .flat().concat(...(this.directories.componentCommands ?? [])),
      jobs: moduleDirectories.map((dir) => dir.jobs)
        .flat().concat(...(this.directories.jobs ?? [])),
      listeners: moduleDirectories.map((dir) => dir.listeners)
        .flat().concat(...(this.directories.listeners ?? [])),
      messageContextMenus: moduleDirectories.map((dir) => dir.messageContextMenus)
        .flat().concat(...(this.directories.messageContextMenus ?? [])),
      userContextMenus: moduleDirectories.map((dir) => dir.userContextMenus)
        .flat().concat(...(this.directories.userContextMenus ?? [])),
    };

    this.commandManager.initialize(mergedDirectories);
    this.jobManager = new ClientJobManager(this, this.commandManager.jobs.toJSON());
    this.registerEssentialListeners();
    return this;
  }

  loadModules = () => {
    this.logger.debug('Loading modules');
    this.loadNPMModules();
    this.modules.forEach((module) => {
      module.register(this);
    });
  };

  loadNPMModules = () => {
    this.logger.debug('[NPM Module] Resolving end-user modules from NPM registry');
    for (const moduleName of officialModules) {
      let npmModule;
      try {
        npmModule = require(`@rhidium/${moduleName}`);
        if (!(npmModule instanceof Module) && !(npmModule.default instanceof Module)) {
          throw new Error([
            `Official Module "${moduleName}" is not an instance of Module,`,
            'this should never happen and was implemented as a fail-safe,',
            'please create a GitHub issue with details.',
          ].join(' '));
        }
        this.logger.debug(`[NPM Module] Loaded Official Module "${moduleName}"`);
        this.modules.push(npmModule);
      }
      catch {
        this.logger.debug(`[NPM Module] Official Module "${moduleName}" not installed`);
        continue;
      }
    }
  };

  registerEssentialListeners = () => {
    this.once(Events.ClientReady, (c) => {
      // Apply branding to our embeds once we log-in
      if (c.user && !this.embeds.brandingOptions.author) this.embeds.brandingOptions.author = {
        name: c.user.username,
        iconURL: c.user.displayAvatarURL(),
      };
    });

    this.on(Events.InteractionCreate, async (interaction) => {
      // Middleware context
      const invokedAt = new Date();
      const startRunTs = process.hrtime();
      const middlewareContext: CommandMiddlewareMetaContext = {
        invokedAt,
        startRunTs,
      };

      // Resolve the command/component identifier
      const commandId = this.commandManager.resolveCommandId(interaction);

      // Resolve the command
      const command = this.commandManager.commandById(commandId);

      // At the time of writing this auto complete is the only
      // non-repliable interaction - separate handler as it
      // doesn't have an overlapping structure with our commands
      if (interaction.isAutocomplete()) {
        const autoCompleteHandler = this.commandManager.autoComplete.get(
          commandId,
        );
        if (!autoCompleteHandler) return;
        await DiscordLogger.tryWithErrorLogging(
          this,
          () => autoCompleteHandler.handleInteraction(interaction),
          'An error occurred while handling an auto complete interaction',
        );
        return;
      }
      
      // Opt out of handler for components - yay!
      if (
        (interaction.isMessageComponent()
        || interaction.isModalSubmit())
        && commandId.startsWith(Constants.EMIT_COMPONENT_HANDLER_IDENTIFIER)
      ) {
        this.logger.debug([
          `Skipping component interaction for command "${commandId}"`,
          `as it starts with the reserved identifier "${Constants.EMIT_COMPONENT_HANDLER_IDENTIFIER}"`,
          'which is used for emitting component handlers',
        ].join(' '));
        return;
      }

      // Make sure we have a command
      if (!command) {
        if (this.extendedOptions.refuseUnknownCommandInteractions) {
          InteractionUtils.replyDynamic(this, interaction, {
            embeds: [
              this.embeds.error({
                title: Lang.t('commands.unknownCommandTitle'),
                description: Lang.t('commands.unknownCommandDescription', { commandId }),
              }),
            ],
          });
          return;
        }
        if (!this.extendedOptions.suppressUnknownInteractionWarning) {
          this.logger.warn(
            `Unknown interaction with id "${commandId}" (${interaction.type})`,
          );
        }
        return;
      }

      // Make sure the command is enabled
      if (command.disabled) {
        InteractionUtils.replyDynamic(this, interaction, {
          embeds: [
            this.embeds.error({
              title: Lang.t('commands.commandDisabledTitle'),
              description: Lang.t('commands.commandDisabledDescription'),
            }),
          ],
          ephemeral: true,
        });
        return;
      }

      // [DEV] - How do we cast Interaction<CacheType> from listener
      // to I extends BaseInteraction - we can't use generics because
      // we don't know the type of the interaction at compile time
      // For now, it's not pretty, but it works!

      if (command instanceof ChatInputCommand) {
        if (!interaction.isChatInputCommand()) {
          throw new Error([
            `Interaction for ChatInputCommand "${commandId}" is not a ChatInputCommand interaction,`,
            'this should never happen and is very likely a bug in your code - please investigate',
            'and create a GitHub issue if you believe this is a bug.',
          ].join(' '));
        }
        await command.handleInteraction(interaction, this, middlewareContext);
      }

      else if (command instanceof UserContextCommand) {
        if (!interaction.isUserContextMenuCommand()) {
          throw new Error([
            `Interaction for UserContextCommand "${commandId}" is not a UserContextCommand interaction,`,
            'this should never happen and is very likely a bug in your code - please investigate',
            'and create a GitHub issue if you believe this is a bug.',
          ].join(' '));
        }
        await command.handleInteraction(interaction, this, middlewareContext);
      }

      else if (command instanceof MessageContextCommand) {
        if (!interaction.isMessageContextMenuCommand()) {
          throw new Error([
            `Interaction for MessageContextCommand "${commandId}" is not a MessageContextCommand interaction,`,
            'this should never happen and is very likely a bug in your code - please investigate',
            'and create a GitHub issue if you believe this is a bug.',
          ].join(' '));
        }
        await command.handleInteraction(interaction, this, middlewareContext);
      }

      else if (interaction.isMessageComponent()) {
        await command.handleInteraction(interaction, this, middlewareContext);
      }

      else if (interaction.isModalSubmit()) {
        if (!(command instanceof ModalCommand)) {
          throw new Error([
            `Interaction for ModalCommand "${commandId}" is not a ModalCommand interaction,`,
            'this should never happen and is very likely a bug in your code - please investigate',
            'and create a GitHub issue if you believe this is a bug.',
          ].join(' '));
        }
        await command.handleInteraction(interaction, this, middlewareContext);
      }

      else { // Unknown command type
        throw new Error([
          `Unknown command type for command "${commandId}" - this should never happen,`,
          'and is very likely a bug in your code - please investigate',
          'and create a GitHub issue if you believe this is a bug.',
        ].join(' '));
      }

      // Send discord logging info (configurable)
      if (this.extendedOptions.commandUsageChannelId) {
        DiscordLogger.logCommandUsage(
          this,
          command,
          interaction,
        );
      }
    });
  };
}
