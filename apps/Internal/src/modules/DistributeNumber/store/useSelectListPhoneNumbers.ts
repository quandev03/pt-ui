import { create } from 'zustand';
import { IPhoneNumberSelect } from 'apps/Internal/src/modules/DistributeNumber/type';

interface IListPhonNumbers {
  listPhoneNumber: IPhoneNumberSelect[];
  setListPhoneNumber: (listPhoneNumber: IPhoneNumberSelect[]) => void;
}

const useSelectListPhoneNumber = create<IListPhonNumbers>((set) => ({
  listPhoneNumber: [],
  setListPhoneNumber: (listPhoneNumber: IPhoneNumberSelect[]) =>
    set({ listPhoneNumber }),
}));
export default useSelectListPhoneNumber;
