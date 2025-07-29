import { IntlProvider, createIntl } from "react-intl";
import useLanguageStore from "./store";
import translate from "./translate";
import { FC, ReactNode } from "react";
import {Language, LanguageType} from "@react/languages/type";

const IntlController: FC<{ children: ReactNode }> = ({ children }) => {
  const { lang } = useLanguageStore();
  return (
    <IntlProvider messages={translate[lang]} locale={lang || Language[LanguageType.VI]}>
      {children}
    </IntlProvider>
  );
};

const getCurrentLanguage = () => useLanguageStore.getState().lang;

const intl = createIntl({
  messages: translate[getCurrentLanguage()],
  locale: getCurrentLanguage() ?? Language[LanguageType.VI],
});
useLanguageStore.getState().setIntlContext(intl);

export default IntlController;
