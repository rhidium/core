import { i18n } from 'i18next';
import { LocaleString } from 'discord.js';

import enLib from '../../locales/en.json';
import nlLib from '../../locales/nl.json';

export const locales: LocaleString[] = ['en-GB', 'nl'];

export const englishLibrary = enLib;
export const dutchLibrary = nlLib;

export type ResourceBundle = {
  lng: string;
  ns: string;
  resources: unknown;
  deep?: boolean;
  overwrite?: boolean;
};

export const defaultResourceBundles = [
  {
    lng: 'en',
    ns: 'lib',
    resources: englishLibrary,
  },
  {
    lng: 'nl',
    ns: 'lib',
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
        bundle.ns,
        bundle.resources,
        bundle.deep,
        bundle.overwrite ?? true
      );
    });
  }
  else {
    clientLang.addResourceBundle('en', defaultNS, englishLibrary);
    clientLang.addResourceBundle('nl', defaultNS, dutchLibrary);
  }
};
