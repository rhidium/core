import Lang from 'i18next';
import { LocaleString } from 'discord.js';

import enLib from '../../locales/en.json';
import nlLib from '../../locales/nl.json';

export const locales: LocaleString[] = ['en-GB', 'nl'];

export const englishLibrary = enLib;
export const dutchLibrary = nlLib;

export const defaultNS = 'lib';

export const initializeLocalization = (debugEnabled = false) => {
  Lang.init({
    // We don't specify lng, as language is determined
    // on Discord\'s side by the user\'s locale.
    debug: debugEnabled,
    fallbackLng: 'en',
    defaultNS,
    resources: {
      en: {
        lib: englishLibrary,
      },
      nl: {
        lib: dutchLibrary,
      },
    },
  });
};

export default Lang;
