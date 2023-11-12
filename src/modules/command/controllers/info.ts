import { ModuleCommandController } from '../types';
import { Constants, InteractionUtils } from '../../..';

export const modulesInfoPageOne = `
# Modules

Modules are a way to organize your code. They allow you to group commands, listeners, etc. into a single module.
They serve as plug-and-play packages that can be added to your client instance.
You can **\`eject\`** the source code of a module to edit it, or build on top of it  in your own local project.

Note: We require all official supported modules to be MIT or ISC licensed, so you're in full control.

Official modules are listed in the [documentation]({{documentationURL}}).
`;

export const modulesInfoPageTwo = `
## Importing

To import a module, you need to install it first.

###  End Users
Official packages, like \`@rhidium/moderation-module\` can be installed from NPM.
These are automatically detected internally, and will be loaded automatically.
You can do this by running \`npm install @rhidium/<module-name>\` in your project directory.

### Developers
Unofficial/local packages have to be added to your \`modules\` array in your client constructor.
You can generate local modules from official packages by running the **\`/modules eject\`** command.
You can also create your own public or private modules from scratch.
Public modules are required to be MIT or ISC licensed.
`;

export const postModuleEjectSteps = `
- Review your \`package.json\`, run \`npm install\` if any changes were made
- Remove the packaged Module from your client constructor and instead import the local module
  - See example below
- Start the bot, and make sure everything works as expected
- Remove the packaged module: \`npm uninstall @rhidium/<module-name>\`
  - \`@rhidium/moderation-module\` in the example below
- Commit and push your changes
`;

export const postModuleEjectExample = `
\`\`\`ts
import { Client } from '@rhidium/core';
import ModerationModule from '@rhidium/moderation-module';

const client = new Client({
  modules: [
    // Remove this is you #eject the module,
    // and replace it with your own local module.
    ModerationModule
  ],
});
\`\`\`
`;

export const modulesInfoPageThree = `
## Ejecting

Ejecting a module will extract all the commands, listeners, etc. from the module and write them to your project.
This is useful for developers who want to edit, or build on top of the modules provided by the framework.

- All official modules are required to be MIT or ISC licensed
- All official modules are open-source and published to NPM
- All official modules are required to export their source code along with the compiled code

**__{{warningEmoji}} Ejecting modules is considered a dangerous/intrusive file operation__**
1. You should always commit your changes BEFORE ejecting a module
2. You should always make sure you can undo the operation
  a. Preferably by using a version control system like Git
  b. Or by making a backup of your project

After ejecting, you should consider taking the following steps:${postModuleEjectSteps}

## Example
${postModuleEjectExample}
`;

export const moduleInfoController: ModuleCommandController = async (
  client,
  interaction
) => {
  const applyPlaceholders = (str: string) => str
    .replaceAll('{{warningEmoji}}', client.clientEmojis.warning)
    .replaceAll('{{documentationURL}}', Constants.LIBRARY_DOCUMENTATION_URL);
  const embeds = [
    modulesInfoPageOne,
    modulesInfoPageTwo,
    modulesInfoPageThree,
  ].map((e) => client.embeds.branding({ description: applyPlaceholders(e) }));
  const pages = embeds.map((e) => ({ embeds: [e] }));
  InteractionUtils.paginator(
    'modules-info',
    client,
    pages,
    interaction
  );
};
