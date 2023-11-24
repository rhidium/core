import { i18n } from 'i18next';
import { LocaleString } from 'discord.js';

import enLib from '../../locales/en.json';
import nlLib from '../../locales/nl.json';

export const locales: LocaleString[] = ['en-GB', 'nl'];

export const englishLibrary = enLib;
export const dutchLibrary = nlLib;

export const defaultNS = 'lib';

export const initializeLocalization = (clientLang: i18n) => {
  clientLang.addResourceBundle('en', defaultNS, englishLibrary);
  clientLang.addResourceBundle('nl', defaultNS, dutchLibrary);
};
