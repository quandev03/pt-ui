import { IntlShape } from "react-intl";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { Language, LanguageType } from "@react/languages/type";
import { APP_CODE, STORAGE_KEY_PREFIX } from "apps/Partner/src/constants";

export interface IReleaseStore {
  lang: string;
  type: LanguageType;
  intl: IntlShape | undefined;

  changedLanguage: (lang: LanguageType) => void;
  setIntlContext: (intl: IntlShape) => void;
}

const useLanguageStore = create(
  persist<IReleaseStore>(
    (set) => ({
      lang: Language[LanguageType.VI],
      type: LanguageType.VI,
      intl: undefined,

      changedLanguage(mode) {
        set(() => ({ lang: Language[mode], type: mode }));
      },
      setIntlContext(intl) {
        set(() => ({ intl: intl }));
      },
    }),
    {
      name: `${STORAGE_KEY_PREFIX}${APP_CODE}:LanguageApp`,
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useLanguageStore;
