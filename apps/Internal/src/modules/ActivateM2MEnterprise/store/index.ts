import { FieldErrorsType } from '@react/commons/types';
import { Key } from 'react';
import { create } from 'zustand';

export interface IActiveSubscriptStore {
  isDisabledContract: boolean;
  setIsDisabledContract: (isChanged: boolean) => void;
  isResetImage: boolean;
  setIsResetImage: (isChanged: boolean) => void;
  dataPersonInfo: {
    startDate?: string;
    endDate?: string;
    idType: string;
    idNo: string;
    idIssueDate: string;
    idIssuePlace: string;
    address: string;
    birthday: string;
    district: string;
    idExpiry: string;
    id: string;
    name: string;
    sex: string;
    province: string;
    precinct: string;
    idFrontPath: string;
    idBackPath: string;
    portraitPath: string;
    authorizedFilePath?: string;
  };
  setDataActivateInfo: (data: object) => void;
  resetDataActivateInfo: () => void;
  listSub: any,
  setListSub: (data: any) => void,
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
  isSub: boolean;
  setIsSub: (data: any) => void;
  isGenCode: boolean;
  setIsGenCode: (data: any) => void;
  // isReset: boolean;
  // setReset: (value: boolean) => void;
}

const dataPersonInfoDefault = {
  startDate: '',
  endDate: '',
  idType: '',
  idNo: '',
  idIssueDate: '',
  idIssuePlace: '',
  address: '',
  birthday: '',
  district: '',
  idExpiry: '',
  id: '',
  name: '',
  sex: '',
  province: '',
  precinct: '',
  idFrontPath: '',
  idBackPath: '',
  portraitPath: '',
  authorizedFilePath: '',
};
const useActivateM2M = create<IActiveSubscriptStore>((set) => ({
  isDisabledContract: true,
  setIsDisabledContract(value) {
    set(() => ({ isDisabledContract: value }));
  },
  isResetImage: false,
  setIsResetImage(value) {
    set(() => ({ isResetImage: value }));
  },
  dataPersonInfo: dataPersonInfoDefault,
  setDataActivateInfo(value) {
    set((state) => ({
      dataPersonInfo: { ...state.dataPersonInfo, ...value },
    }));
  },
  resetDataActivateInfo() {
    set(() => ({
      dataActivateInfo: dataPersonInfoDefault,
      isDisabledContract: true,
      isShowSignLink: false,
      isSignSuccess: false,
      activeSubmitMore3: true,
      countFailOtp: 0,
      isSuccessCheckCondition: false,
      isDisableButtonCheck: false,
    }));
  },
  listSub: null,
  setListSub (value) {
    set(() => ({ listSub: value }));
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
      dataActivateInfo: dataPersonInfoDefault,
      activeSubmitMore3: true,
      countFailOtp: 0,
      isSuccessCheckCondition: false,
      isDisableButtonCheck: false,
      timeError: '',
      isSub: true,
      isGenCode: true
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
  isSub: true,
  setIsSub(value) {
    set(() => ({ isSub: value }));
  },
  isGenCode: true,
  setIsGenCode(value) {
    set(() => ({ isGenCode: value }));
  },
  // isReset: false,
  // setReset: (value: boolean) => void;
}));
export default useActivateM2M;
