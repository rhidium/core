import Lang from 'i18next';

import enLib from '../../locales/en/lib.json';
import nlLib from '../../locales/nl/lib.json';

export const englishLibrary = enLib;
export const dutchLibrary = nlLib;

export const defaultNS = 'lib';

export const isInitialized = () => Lang.isInitialized;

export const init = (debugEnabled = false) => {
  if (isInitialized()) return;
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
