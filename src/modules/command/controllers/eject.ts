import { InteractionUtils, ModulesCommand, isAutoCompleteResponseType } from '../../..';
import { SelectModuleOption } from '../helpers';
import { ModuleCommandController } from '../types';
import { modulesInfoPageThree, postModuleEjectExample, postModuleEjectSteps } from './info';

// [DEV]: Eventually, a CLI is to be made for this.

export const moduleEjectController: ModuleCommandController = async (
  client,
  interaction
) => {
  const {options} = interaction;
  const dirPath = `${options.getString('path', false) ?? './src/rhidium-modules'}`;
  
  if (!dirPath.startsWith('./')) {
    InteractionUtils.replyDynamic(client, interaction, {
      embeds: [
        client.embeds.error({
          title: 'Invalid Path',
          description: 'The path is relative to the project root, and must start with `./`',
        }),
      ],
      ephemeral: true,
    });
    return;
  }

  const rhidiumModule = await SelectModuleOption.getValue(interaction, true);
  if (isAutoCompleteResponseType(rhidiumModule)) return;

  const modulePath = `${dirPath}/${rhidiumModule.name}`;
  const confirmEmbed = client.embeds.waiting({
    title: 'Eject Module | Confirmation',
    description: `Are you sure you want to eject the module **\`${rhidiumModule.name}\`** to \`${modulePath}\`?${
      modulesInfoPageThree.replaceAll('{{warningEmoji}}', client.clientEmojis.warning)
    }`,
  });

  InteractionUtils.promptConfirmation({
    client,
    interaction,
    content: {
      embeds: [ confirmEmbed ],
    },
    onConfirm: async (i) => {
      await ModulesCommand.deferReplyInternal(i);
      await rhidiumModule.eject(client, modulePath);
      i.editReply({
        content: null,
        embeds: [
          client.embeds.success({
            title: 'Eject Module | Success',
            description: `
              Ejected module **\`${rhidiumModule.name}\`** to \`${modulePath}\`

              You should now consider taking the following steps:${postModuleEjectSteps}${postModuleEjectExample}
            `,
          }),
        ],
        components: [],
      });
    },
  });
};

