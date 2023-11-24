import { Client } from '../../client';
import { InteractionUtils } from '../../utils';
import { BaseInteraction, Snowflake } from 'discord.js';

export interface IRequiredResources {
  guilds: Snowflake[];
  channels: Snowflake[];
  roles: Snowflake[];
  users: Snowflake[];
  categories: Snowflake[];
}

export class RequiredResources<I extends BaseInteraction>
implements IRequiredResources
{
  guilds: Snowflake[];
  channels: Snowflake[];
  roles: Snowflake[];
  users: Snowflake[];
  categories: Snowflake[];
  constructor(options: Partial<IRequiredResources>) {
    this.guilds = options.guilds ?? [];
    this.channels = options.channels ?? [];
    this.roles = options.roles ?? [];
    this.users = options.users ?? [];
    this.categories = options.categories ?? [];
  }

  matchGuilds = (client: Client, interaction: I, handleInteraction = false) => {
    const match =
      this.guilds.length === 0 ||
      this.guilds.some((id) => id === interaction.guildId);
    if (!match) {
      if (handleInteraction) {
        InteractionUtils.replyDynamic(client, interaction, {
          content: client.I18N.t('lib:commands.notAvailableInCurrentServer'),
          ephemeral: true,
        });
      }
      return false;
    }
    return true;
  };

  matchChannels = (client: Client, interaction: I, handleInteraction = false) => {
    const match =
      this.channels.length === 0 ||
      this.channels.some((id) => id === interaction.channelId);
    if (!match) {
      if (handleInteraction) {
        InteractionUtils.replyDynamic(client, interaction, {
          content: client.I18N.t('lib:commands.notAvailableInCurrentChannel'),
          ephemeral: true,
        });
      }
      return false;
    }
    return true;
  };

  matchRoles = (client: Client, interaction: I, handleInteraction = false) => {
    if (this.roles.length === 0) return true;
    if (!interaction.inGuild()) {
      // Return false early if this is a DM interaction
      // the roles are required - and the member does NOT have the roles
      // in this DM channel
      if (handleInteraction) {
        InteractionUtils.replyDynamic(client, interaction, {
          content: client.I18N.t('lib:commands.notAvailableInDMs'),
          ephemeral: true,
        });
      }
      return false;
    }
    if (!interaction.inCachedGuild()) {
      // Return false early if this is an uncached guild
      // Never matches until we **can** check if this matches
      if (handleInteraction) {
        InteractionUtils.replyDynamic(client, interaction, {
          content: client.I18N.t('lib:commands.requiredRolesMissingServer'),
          ephemeral: true,
        });
      }
      return false;
    }

    const match = this.roles.some((id) =>
      interaction.member.roles.cache.has(id),
    );
    if (!match) {
      if (handleInteraction) {
        InteractionUtils.replyDynamic(client, interaction, {
          content: client.I18N.t('lib:commands.requiredRolesMissing'),
          ephemeral: true,
        });
      }
      return false;
    }

    return true;
  };

  matchUsers = (client: Client, interaction: I, handleInteraction = false) => {
    const match =
      this.users.length === 0 || this.users.some((id) => id === interaction.id);
    if (!match) {
      if (handleInteraction) {
        InteractionUtils.replyDynamic(client, interaction, {
          content: client.I18N.t('lib:commands.requiredUsersMissing'),
          ephemeral: true,
        });
      }
      return false;
    }
    return true;
  };

  matchCategories = (client: Client, interaction: I, handleInteraction = false) => {
    const match =
      this.categories.length === 0 ||
      !interaction.inGuild() ||
      this.categories.some((id) => interaction.channel?.parentId === id);

    if (!match) {
      if (handleInteraction) {
        InteractionUtils.replyDynamic(client, interaction, {
          content: client.I18N.t('lib:commands.requiredCategoryMissing'),
          ephemeral: true,
        });
      }
      return false;
    }
    return true;
  };

  match = (client: Client, interaction: I, handleInteraction: boolean) =>
    this.matchGuilds(client, interaction, handleInteraction) &&
    this.matchChannels(client, interaction, handleInteraction) &&
    this.matchRoles(client, interaction, handleInteraction) &&
    this.matchUsers(client, interaction, handleInteraction) &&
    this.matchCategories(client, interaction, handleInteraction);
}
