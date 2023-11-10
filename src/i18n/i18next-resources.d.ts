/* eslint-disable max-len */

interface Resources {
  lib: {
    invalidUser: 'Invalid user';
    timestampName: 'Timestamp';
    commands: {
      unknownCommandTitle: 'Unknown Command';
      unknownCommandDescription: 'The command with id "{{commandId}}" was not found';
      commandDisabledTitle: 'Command Disabled';
      commandDisabledDescription: 'This command is temporarily disabled - please try again later';
      noChannelForPermissionCheck: 'I can\'t determine the channel to check required permissions for this command.';
      clientMissingPermissions: 'I don\'t have the required permissions to execute this command.';
      userMissingPermissions: 'You don\'t have the required permissions to use this command.';
      missingPermissions: 'Missing permissions';
      isNotComponentUser: 'This component can only be used by the user who initiated it';
      permLevelTooLow: 'You don\'t have the required permission level to use this command.';
      noChannelForNSFWCheck: 'I can\'t determine if this channel is NSFW, so I won\'t execute this NSFW command.';
      noNSFWInDM: 'This command is NSFW, and can\'t be executed in DM\'s.';
      noNSFWInThread: 'This command is NSFW, and can\'t be executed in threads.';
      noNSFWInSFWChannel: 'This command is NSFW, and can\'t be executed in non-NSFW channels.';
      missingRequiredOptionTitle: 'Missing Required Option';
      missingRequiredACOptionDescription: 'The auto-complete option `{{optionName}}` is required. Please provide a value by selecting it from the list of available choices.';
      notAvailableInDMs: 'This command is not available in DMs';
      notAvailableInCurrentServer: 'This command is not available in this server.';
      notAvailableInCurrentChannel: 'This command is not available in this channel.';
      requiredRolesMissingServer: 'Required roles are not available in this server because it is uncached.';
      requiredRolesMissing: 'You do not have the required roles to use this command.';
      requiredUsersMissing: 'You are not in the list of whitelisted users for this command.';
      requiredCategoryMissing: 'This command is not available in this category.';
      missingCachedServer: 'This command is not available in this server because it is uncached, please try again';
      serverUnavailable: 'Server temporarily unavailable, please try again later';
      missingInitialReply: 'Failed to send initial reply, please try again later';
      isNotUserPaginator: 'You cannot interact with this paginator, it was not invoked/initiated by you';
      errorWhileReplyingToInteraction: 'An error occurred while attempting to reply to your interaction, the developers have been notified of this issue - please try again later';
    };
  };
}

export default Resources;
