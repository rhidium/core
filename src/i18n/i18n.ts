import Lang from 'i18next';

import enLib from '../../locales/en/lib.json';
import nlLib from '../../locales/nl/lib.json';

export const englishLibrary = enLib;
export const dutchLibrary = nlLib;

export const defaultNS = 'lib';

export const init = (debugEnabled = false) =>
  Lang.init({
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

export default Lang;
