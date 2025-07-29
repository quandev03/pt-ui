import { formatDateEnglishV2 } from '@react/constants/moment';
import dayjs from 'dayjs';
import { create } from 'zustand';
import { ISimReplacementParams } from '../types';

const detailParamsDefault = {
  page: 0,
  size: 20,
  fromDate: dayjs().subtract(29, 'day').format(formatDateEnglishV2),
  toDate: dayjs().format(formatDateEnglishV2),
  q: '',
};

export interface ISimReplacementStore {
  detailParams: ISimReplacementParams;
  setDetailParams: (params: ISimReplacementParams) => void;
  resetSimReplacementStore: () => void;
}
const useSimReplacementStore = create<ISimReplacementStore>((set) => ({
  detailParams: detailParamsDefault,
  setDetailParams(params) {
    set(() => ({ detailParams: params }));
  },
  resetSimReplacementStore() {
    set(() => ({
      detailParams: detailParamsDefault,
    }));
  },
}));
export default useSimReplacementStore;
