import Resources from './i18next-resources';

export const defaultNS = 'lib';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS;
    resources: Resources;
  }
}
