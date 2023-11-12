import { Constants, ModulesCommand } from '../../..';
import { ModuleCommandController } from '../types';
import { stripIndents } from 'common-tags';

export const moduleListController: ModuleCommandController  = async (
  client,
  interaction
) => {
  const modules = client.modules.map((module) => `${module.name}@${module.version}`);

  if (!modules[0]) {
    await ModulesCommand.reply(interaction, client.embeds.error({
      title: 'No modules',
      description: stripIndents`You're not using any plug-and-play modules.
        To get started, check out the [documentation](
          ${Constants.LIBRARY_DOCUMENTATION_URL}
        ) for a list of available modules.
      `,
    }));
    return;
  }

  await ModulesCommand.reply(interaction, client.embeds.branding({
    title: 'Modules',
    description: stripIndents`You're currently using the following plug-and-play modules: \`\`\`diff
      ${modules.join('\n')}
    \`\`\``,
  }));
};
