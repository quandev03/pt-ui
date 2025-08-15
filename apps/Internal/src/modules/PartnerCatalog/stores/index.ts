import { create } from 'zustand';
import { IOrganizationUnitDTO, IPartner } from '../types';

export interface IPartnerCatalogStore {
  provinceSelected: string;
  districtSelected: string;
  partnerTarget?: IOrganizationUnitDTO;
  openProductAuthorization: boolean;
  openStockPermission: boolean;
  partnerDetail?: IPartner;
  setPartnerDetail: (partnerDetail?: IPartner) => void;
  setPartnerTarget: (partnerTarget?: IOrganizationUnitDTO) => void;
  setOpenProductAuthorization: (openProductAuthorization: boolean) => void;
  setOpenStockPermission: (openStockPermission: boolean) => void;
  setProvinceSelected: (provinceSelected: string) => void;
  setDistrictSelected: (districtSelected: string) => void;

  resetOrderStore: () => void;
}

const usePartnerStore = create<IPartnerCatalogStore>((set) => ({
  provinceSelected: '',
  districtSelected: '',
  openProductAuthorization: false,
  setPartnerDetail(partnerDetail) {
    set(() => ({ partnerDetail }));
  },
  openStockPermission: false,
  setOpenStockPermission(openStockPermission) {
    set(() => ({ openStockPermission }));
  },
  setPartnerTarget(partnerTarget) {
    set(() => ({ partnerTarget }));
  },
  setOpenProductAuthorization(openProductAuthorization) {
    set(() => ({ openProductAuthorization }));
  },
  resetOrderStore() {
    set(() => ({}));
  },
  setProvinceSelected(provinceSelected) {
    set(() => ({ provinceSelected }));
  },
  setDistrictSelected(districtSelected) {
    set(() => ({ districtSelected }));
  },
}));
export default usePartnerStore;
