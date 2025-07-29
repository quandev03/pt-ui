import { FieldErrorsType } from '@react/commons/types';
import { Key } from 'react';
import { create } from 'zustand';

export interface IActiveSubscriptStore {
  isDisabledContract: boolean;
  setIsDisabledContract: (isChanged: boolean) => void;
  isResetImage: boolean;
  setIsResetImage: (isChanged: boolean) => void;
  dataActivateInfo: {
    address: string;
    birthday: string;
    check_sendOTP: boolean;
    city: string;
    district: string;
    document: string;
    errors: FieldErrorsType[];
    c06_errors: string;
    expiry: string;
    id: string;
    id_ekyc: string;
    issue_by: string;
    issue_date: string;
    list_phoneNumber: string[];
    name: string;
    sex: string;
    ward: string;
  };
  setDataActivateInfo: (data: object) => void;
  resetDataActivateInfo: () => void;
  isShowSignLink: boolean;
  setIsShowSignLink: (data: boolean) => void;
  resetGroupStore: () => void;
  formAntd: any;
  setFormAntd: (data: any) => void;
  deviceToken: string;
  setDeviceToken: (data: string) => void;
  isSignSuccess: boolean;
  setSignSuccess: (data: boolean) => void;
  isSignND13Success: boolean;
  setSignND13Success: (data: boolean) => void;
  isOpenModalPdf: boolean;
  setOpenModalPdf: (data: boolean) => void;
  imageNd13: string;
  setImageNd13: (data: string) => void;
  activeKeyNd13: string;
  setActiveKeyNd13: (data: string) => void;
  interval: any;
  setIntervalApi: (data: any) => void;
  selectedRowKeys: Key[];
  setSelectedRowKeys: (data: any) => void;
  activeSubmitMore3: boolean;
  setActiveSubmitMore3: (data: any) => void;
  countFailOtp: number;
  setCountFailOtp: (data: number) => void;
  isSuccessCheckCondition: boolean;
  setSuccessCheckCondition: (data: any) => void;
  isDisableButtonCheck: boolean;
  setDisableButtonCheck: (data: any) => void;
  timeError: string;
  setTimeError: (data: string) => void;
  // isReset: boolean;
  // setReset: (value: boolean) => void;
}

const dataActivateInfoDefault = {
  address: '',
  birthday: '',
  check_sendOTP: false,
  city: '',
  district: '',
  document: '',
  errors: [],
  c06_errors: '',
  expiry: '',
  id: '',
  id_ekyc: '',
  issue_by: '',
  issue_date: '',
  list_phoneNumber: [],
  name: '',
  sex: '',
  ward: '',
};
const useActiveSubscriptStore = create<IActiveSubscriptStore>((set) => ({
  isDisabledContract: true,
  setIsDisabledContract(value) {
    set(() => ({ isDisabledContract: value }));
  },
  isResetImage: false,
  setIsResetImage(value) {
    set(() => ({ isResetImage: value }));
  },
  dataActivateInfo: dataActivateInfoDefault,
  setDataActivateInfo(value) {
    set((state) => ({
      dataActivateInfo: { ...state.dataActivateInfo, ...value },
    }));
  },
  resetDataActivateInfo() {
    set(() => ({
      dataActivateInfo: dataActivateInfoDefault,
      isDisabledContract: true,
      isShowSignLink: false,
      isSignSuccess: false,
      activeSubmitMore3: true,
      countFailOtp: 0,
      isSuccessCheckCondition: false,
      isDisableButtonCheck: false,
    }));
  },
  isShowSignLink: false,
  setIsShowSignLink(value) {
    set(() => ({ isShowSignLink: value }));
  },
  resetGroupStore() {
    set(() => ({
      isDisabledContract: true,
      isShowSignLink: false,
      isSignSuccess: false,
      isSignND13Success: false,
      activeKeyNd13: '0',
      dataActivateInfo: dataActivateInfoDefault,
      activeSubmitMore3: true,
      countFailOtp: 0,
      isSuccessCheckCondition: false,
      isDisableButtonCheck: false,
      timeError: '',
    }));
  },
  formAntd: null,
  setFormAntd(value) {
    set(() => ({ formAntd: value }));
  },
  deviceToken: '',
  setDeviceToken(value) {
    set(() => ({ deviceToken: value }));
  },
  isSignSuccess: false,
  setSignSuccess(value) {
    set(() => ({ isSignSuccess: value }));
  },
  isSignND13Success: false,
  setSignND13Success(value) {
    set(() => ({ isSignND13Success: value }));
  },
  isOpenModalPdf: false,
  setOpenModalPdf(value) {
    set(() => ({ isOpenModalPdf: value }));
  },
  imageNd13: '',
  setImageNd13(value) {
    set(() => ({ imageNd13: value }));
  },
  activeKeyNd13: '0',
  setActiveKeyNd13(value) {
    set(() => ({ activeKeyNd13: value }));
  },
  interval: undefined,
  setIntervalApi(value) {
    set(() => ({ interval: value }));
  },
  selectedRowKeys: [],
  setSelectedRowKeys(value) {
    set(() => ({ selectedRowKeys: value }));
  },
  activeSubmitMore3: true,
  setActiveSubmitMore3(value) {
    set(() => ({ activeSubmitMore3: value }));
  },
  countFailOtp: 0,
  setCountFailOtp(value) {
    set(() => ({ countFailOtp: value }));
  },
  isSuccessCheckCondition: false,
  setSuccessCheckCondition(value) {
    set(() => ({ isSuccessCheckCondition: value }));
  },
  isDisableButtonCheck: false,
  setDisableButtonCheck(value) {
    set(() => ({ isDisableButtonCheck: value }));
  },
  timeError: '',
  setTimeError(value) {
    set(() => ({ timeError: value }));
  },
  // isReset: false,
  // setReset: (value: boolean) => void;
}));
export default useActiveSubscriptStore;
