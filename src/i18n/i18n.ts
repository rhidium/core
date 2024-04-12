import { i18n } from 'i18next';
import { LocaleString } from 'discord.js';

import enLib from '../../locales/en.json';
import nlLib from '../../locales/nl.json';

export const locales: LocaleString[] = ['en-GB', 'nl'];

export const englishLibrary = enLib;
export const dutchLibrary = nlLib;

export type ResourceBundle = {
  lng: LocaleString;
  resources: typeof enLib;
};

export const defaultResourceBundles = [
  {
    lng: locales[0] as LocaleString,
    resources: englishLibrary,
  },
  {
    lng: locales[1] as LocaleString,
    resources: dutchLibrary,
  },
];

export const defaultNS = 'lib';

export const initializeLocalization = (
  clientLang: i18n,
  resourceBundles?: ResourceBundle[]
) => {
  if (resourceBundles && resourceBundles.length) {
    resourceBundles.forEach((bundle) => {
      clientLang.addResourceBundle(
        bundle.lng,
        defaultNS,
        bundle.resources,
        true,
        true
      );
    });
  }
  else {
    clientLang.addResourceBundle('en-GB', defaultNS, englishLibrary);
    clientLang.addResourceBundle('nl', defaultNS, dutchLibrary);
  }
};
