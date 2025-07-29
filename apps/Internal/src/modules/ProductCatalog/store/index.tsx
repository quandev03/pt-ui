import { create } from 'zustand';

interface ProductCatalogStore {
  unitHetTocDoCaoGiamXuong: string;
  unitDungLuongTocDoCao: string;
  productDescription: string;
  selectedLanguage: string;
  setUnitHetTocDoCaoGiamXuong: (unit: string) => void;
  setUnitDungLuongTocDoCao: (unit: string) => void;
  setProductDescription: (description: string) => void;
  setSelectedLanguage: (language: string) => void;
  reset: () => void;
}

export const useProductCatalogStore = create<ProductCatalogStore>((set) => ({
  unitHetTocDoCaoGiamXuong: "",
  unitDungLuongTocDoCao: "",
  productDescription: "",
  selectedLanguage: "",
  setUnitHetTocDoCaoGiamXuong: (unit: string) => set({ unitHetTocDoCaoGiamXuong: unit }),
  setUnitDungLuongTocDoCao: (unit: string) => set({ unitDungLuongTocDoCao: unit }),
  setProductDescription: (description: string) => set({ productDescription: description }),
  setSelectedLanguage: (language: string) => set({ selectedLanguage: language }),
  reset: () => set({ unitHetTocDoCaoGiamXuong: "", unitDungLuongTocDoCao: "", productDescription: "", selectedLanguage: "" }),
}));



