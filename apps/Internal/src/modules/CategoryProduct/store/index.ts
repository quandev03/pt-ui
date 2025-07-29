import { create } from 'zustand';


export interface ICategoryProductStore {
  isValuesChanged: boolean;
  setIsValuesChanged: (isChanged: boolean) => void;
  resetCategoryProductStore: () => void;
  translatedValues: { [key: string]: { value: string, language: string } };
  updateTranslatedValue: (key: string, value: string, language: string) => void;
  resetTranslatedValues: (key: string) => void;
  resetAttributeTranslatedValues: (attributeIndex: number) => void;
  updateTranslatedValuesAfterRemove: (removedIndex: number) => void;
}
const useCategoryProductStore = create<ICategoryProductStore>((set) => ({
  isValuesChanged: false,
  setIsValuesChanged(isChanged) {
    set(() => ({ isValuesChanged: isChanged }));
  },
  translatedValues: {},
  updateTranslatedValue(key, value, language) {
    set((state) => ({
      translatedValues: { ...state.translatedValues, [key]: {value, language} },
    }));
  },
  resetTranslatedValues(fieldName: string) {
    set((state) => {
        const newTranslatedValues = { ...state.translatedValues };
        for (const key in newTranslatedValues) {
            if (key.startsWith(`${fieldName}-`) || key === fieldName) {
                delete newTranslatedValues[key];
            }
        }
        return { translatedValues: newTranslatedValues };
    });
},
  resetCategoryProductStore() {
    set(() => ({
      isValuesChanged: false,
      translatedValues: {},
    }));
  },
  resetAttributeTranslatedValues(attributeIndex: number) {
    set((state) => {
      const newTranslatedValues = { ...state.translatedValues };
      Object.keys(newTranslatedValues).forEach(key => {
        if (key.startsWith(`${attributeIndex}-`) || key === `${attributeIndex}`) {
          delete newTranslatedValues[key];
        }
      });
      return { translatedValues: newTranslatedValues };
    });
  },
  updateTranslatedValuesAfterRemove(removedIndex: number) {
    set((state) => {
      const newTranslatedValues: typeof state.translatedValues = {};
      Object.entries(state.translatedValues).forEach(([key, value]) => {
        const [attrIndex, valueIndex] = key.split('-').map(Number);
        
        if (attrIndex > removedIndex) {
          const newAttrIndex = attrIndex - 1;
          const newKey = valueIndex !== undefined ? `${newAttrIndex}-${valueIndex}` : `${newAttrIndex}`;
          newTranslatedValues[newKey] = value;
        } else if (attrIndex < removedIndex) {
          newTranslatedValues[key] = value;
        }
      });

      return { translatedValues: newTranslatedValues };
    });
  },
}));
export default useCategoryProductStore;
