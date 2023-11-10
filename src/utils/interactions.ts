import {
  ActionRowBuilder,
  AnyComponentBuilder,
  BaseInteraction,
  BaseMessageOptions,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  ComponentType,
  DiscordAPIError,
  DiscordjsError,
  InteractionReplyOptions,
  RepliableInteraction,
} from 'discord.js';
import { DiscordConstants, UnitConstants } from '../constants';
import { Client } from '../client';
import { AvailableGuildInteraction } from '../commands/Controllers';
import Lang from '../i18n/i18n';

export interface InteractionReplyDynamicOptions {
  preferFollowUp?: boolean;
}

/**
   * Resolves the applicable reply function for the given interaction
   *
   * Note: This is function should never be assigned to a variable, as it's purpose is
   * dynamically resolving the reply function for the given interaction. If you
   * assign this to a variable, it will always resolve to the same function.
   *
   * Example:
   * ```ts
   * InteractionUtils.replyFn(interaction)(content);
   * ```
   * @param interaction The interaction to resolve the reply function for
   * @param preferFollowUp Whether to prefer a follow-up reply over an edit
   * @returns The applicable reply function for the given interaction and options
   */
const replyFn = <I extends BaseInteraction>(
  client: Client,
  interaction: I,
  options?: InteractionReplyDynamicOptions,
) => {
  const { logger } = client;
  if (!interaction.isRepliable()) {
    const noop = async (content: InteractionReplyOptions) =>
      new Promise<null>(() => {
        logger.warn(
          `Interaction ${interaction.id} is not repliable, and cannot be replied to - returning no-operation`,
        );
        logger.warn(
          'This is very likely a bug in your code, and you should analyze the content below to determine the issue:',
        );
        logger.startLog('Non-repliable Interaction Content');
        console.table(content);
        logger.endLog('Non-repliable Interaction Content');
      });
    return noop;
  }

  // Bind interaction to applicable reply function
  if (interaction.replied || interaction.deferred) {
    if (options?.preferFollowUp)
      return interaction.followUp.bind(interaction);
    else return interaction.editReply.bind(interaction);
  } else {
    // Fail-safe - no reply after DiscordConstants.MS_UNTIL_INTERACTION_EXPIRES
    // but interaction wasn't deferred or replied to
    if (
      interaction.createdTimestamp <
        Date.now().valueOf() - DiscordConstants.MS_UNTIL_INTERACTION_EXPIRES
    ) {
      return async (content: InteractionReplyOptions) =>
        new Promise<null>(() => {
          logger.error(
            `Interaction ${interaction.id} was not replied to, and has expired - returning no-operation`,
          );
          logger.warn(
            'This is very likely a bug in your code, and you should analyze the content below to determine the issue:',
          );
          logger.startLog('Expired Interaction Content');
          console.table(content);
          logger.endLog('Expired Interaction Content');
        });
    }
    return interaction.reply.bind(interaction);
  }
};

/**
   * Reply to an interaction - dynamically resolves the reply function,
   * and calls it with the given content, util to avoid having to
   * directly invoke the replyFn method, as explained in it's declaration
   * 
   * Note: It definitely needs the client, as it needs to be able to
   * log critical errors if they are encountered while replying
   * to interactions - it's worth all the client not null checks
   *
   * @param interaction The interaction to reply to
   * @param content The content/ctx to reply with
   * @returns Reply method return value - use `fetchReply` if appropriate
   */
const replyDynamic = async <I extends BaseInteraction>(
  client: Client,
  interaction: I,
  content: InteractionReplyOptions,
  options?: InteractionReplyDynamicOptions,
) => {
  const { logger } = client;
  const replyFn = InteractionUtils.replyFn(client, interaction, options);
  const logReplyErr = (err: unknown, ctx: InteractionReplyOptions) => {
    const msg =
        err instanceof DiscordjsError || err instanceof DiscordAPIError
          ? err.message
          : `${err}`;
    logger.error(
      `Failed to reply to interaction ${interaction.id} - ${msg}`,
    );
    logger.warn(
      'Above error encountered while attempting to reply to interaction with following content:',
    );
    logger.startLog('Interaction Content');
    console.dir(ctx, { depth: Infinity });
    logger.endLog('Interaction Content');
  };

  try {
    return await replyFn(content);
  } catch (err) {
    logReplyErr(err, content);
    const errCtx = {
      content: Lang.t('commands.errorWhileReplyingToInteraction'),
      ephemeral: true,
    };
    await replyFn(errCtx).catch((err: unknown) => {
      logReplyErr(err, errCtx);
    });
    return null;
  }
};

const resolveRowsFromComponents = (components: (AnyComponentBuilder | null)[]) => {
  const rows = [];
  let currentRow = [];
  for (const component of components) {
    if (currentRow.length === 5 || component === null) {
      rows.push(currentRow);
      currentRow = [];
    }
    currentRow.push(component);
  }
  if (currentRow.length > 0) rows.push(currentRow);
  return rows;
};

const channelTypeToString = (type: ChannelType): string => {
  switch (type) {
  case ChannelType.GuildText: return 'Text';
  case ChannelType.GuildVoice: return 'Voice';
  case ChannelType.GuildCategory: return 'Category';
  case ChannelType.GuildStageVoice: return 'Stage';
  case ChannelType.PublicThread: return 'Public Thread';
  case ChannelType.PrivateThread: return 'Private Thread';
  case ChannelType.GuildAnnouncement: return 'Announcement';
  case ChannelType.AnnouncementThread: return 'Announcement Thread';
  case ChannelType.DM: return 'DM';
  case ChannelType.GroupDM: return 'Group DM';
  case ChannelType.GuildForum: return 'Guild Forum';
  case ChannelType.GuildDirectory: return 'Guild Directory';
  default: return 'Unknown';
  }
};

const requireGuild = <I extends BaseInteraction>(
  client: Client,
  interaction: BaseInteraction
): interaction is AvailableGuildInteraction<I> => {
  if (!interaction.inGuild()) {
    InteractionUtils.replyDynamic(client, interaction, {
      content: Lang.t('lib:commands.notAvailableInDMs'),
      ephemeral: true,
    });
    return false;
  }

  if (!interaction.inCachedGuild()) {
    InteractionUtils.replyDynamic(client, interaction, {
      content: Lang.t('lib:commands.missingCachedServer'),
      ephemeral: true,
    });
    return false;
  }

  return true;
};

const requireAvailableGuild = <I extends BaseInteraction>(
  client: Client,
  interaction: I
): interaction is AvailableGuildInteraction<I> => {
  if (!InteractionUtils.requireGuild(client, interaction)) return false;
  if (!interaction.guild.available) {
    InteractionUtils.replyDynamic(client, interaction, {
      content: Lang.t('commands.serverUnavailable'),
      ephemeral: true,
    });
    return false;
  }

  interaction.channel;
  interaction.member;
  interaction.guild;
  interaction.guildId;
  interaction.guildLocale;
  
  return true;
};

const paginator = async (
  id: string,
  client: Client,
  pages: BaseMessageOptions[],
  interaction: RepliableInteraction,
  duration = UnitConstants.MS_IN_ONE_HOUR,
  options?: InteractionReplyDynamicOptions,
) => {
  const goToFirstId = `@pagination:${id}:first`;
  const goToPreviousId = `@pagination:${id}:previous`;
  const goToNextId = `@pagination:${id}:next`;
  const goToLastId = `@pagination:${id}:last`;
  const paginationIds = [ goToFirstId, goToPreviousId, goToNextId, goToLastId ];

  let pageNow = 0;
  const isOnFirstPage = () => pageNow === 0;
  const isOnLastPage = () => pageNow === pages.length - 1;
  const controlRow = (forceDisable = false) => new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(goToFirstId)
      .setDisabled(forceDisable || isOnFirstPage())
      .setLabel('First')
      .setEmoji('⏮️')
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId(goToPreviousId)
      .setDisabled(forceDisable || isOnFirstPage())
      .setLabel('Previous')
      .setEmoji('◀️')
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId(goToNextId)
      .setDisabled(forceDisable || isOnLastPage())
      .setLabel('Next')
      .setEmoji('▶️')
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId(goToLastId)
      .setDisabled(forceDisable || isOnLastPage())
      .setLabel('Last')
      .setEmoji('⏭️')
      .setStyle(ButtonStyle.Primary),
  );

  const paginator = async (page: number) => {
    const content = pages[page];
    if (!content) return;
    await interaction.editReply({
      ...content,
      components: [ controlRow() ],
      ...options,
    });
  };

  const initialReply = await InteractionUtils.replyDynamic(client, interaction, {
    ...pages[0],
    components: [ controlRow() ],
    fetchReply: true,
    ...options,
  });

  // [DEV] - DEV
  // select menu to paginator
  // @customId handling and documentation

  if (!initialReply) {
    InteractionUtils.replyDynamic(client, interaction, {
      content: Lang.t('commands.missingInitialReply'),
      ephemeral: true,
      ...options,
    });
    return;
  }

  const collector = initialReply.createMessageComponentCollector({
    componentType: ComponentType.Button,
    time: duration,
    filter: (i) => paginationIds.includes(i.customId),
  });

  collector.on('collect', async (button) => {
    if (button.user.id !== interaction.user.id) {
      InteractionUtils.replyDynamic(client, interaction, {
        content: Lang.t('commands.isNotUserPaginator'),
        ephemeral: true,
        ...options,
      });
      return;
    }

    await button.deferUpdate();

    if (button.customId === goToFirstId) {
      pageNow = 0;
      await paginator(pageNow);
    }

    if (button.customId === goToPreviousId) {
      if (pageNow === 0) pageNow = pages.length - 1;
      else pageNow--;
      await paginator(pageNow);
    }

    if (button.customId === goToNextId) {
      if (pageNow === pages.length - 1) pageNow = 0;
      else pageNow++;
      await paginator(pageNow);
    }

    if (button.customId === goToLastId) {
      pageNow = pages.length - 1;
      await paginator(pageNow);
    }
  });

  collector.on('end', async () => {
    await initialReply.edit({
      components: [controlRow(true)],
    });
  });
};

export class InteractionUtils {
  static readonly replyFn = replyFn;
  static readonly replyDynamic = replyDynamic;
  static readonly resolveRowsFromComponents = resolveRowsFromComponents;
  static readonly channelTypeToString = channelTypeToString;
  static readonly requireGuild = requireGuild;
  static readonly requireAvailableGuild = requireAvailableGuild;
  static readonly paginator = paginator;
}
