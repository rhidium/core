import Lang, { i18n } from 'i18next';
import { LocaleString } from 'discord.js';

import enLib from '../../locales/en.json';
import nlLib from '../../locales/nl.json';

export const locales: LocaleString[] = ['en-GB', 'nl'];

export const englishLibrary = enLib;
export const dutchLibrary = nlLib;

export const defaultNS = 'lib';

export const initializeLocalization = (Lang: i18n) => {
  Lang.addResourceBundle('en', defaultNS, englishLibrary);
  Lang.addResourceBundle('nl', defaultNS, dutchLibrary);
};

export default Lang;
