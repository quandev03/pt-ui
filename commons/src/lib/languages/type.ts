import { IntlShape } from 'react-intl';

export enum LanguageType {
  VI = 'VI',
  EN = 'EN',
}

export const Language: { [key in LanguageType]: string } = {
  [LanguageType.VI]: 'vi',
  [LanguageType.EN]: 'en',
};

export interface State {
  lang: string;
  type: LanguageType;
  intl: IntlShape | undefined;
}
