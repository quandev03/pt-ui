import { FieldErrorsType } from '@react/commons/types';
import { uniq } from 'lodash';
import { Key } from 'react';
import { create } from 'zustand';
import { ContractTypeEnum } from '../hooks/useDetailContract';

type TransferInfo = {
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
type State = {
  checkSubInfoSuccess: boolean;
  selectedRowKeys: Key[];
  activeKeyNd13: string;
  imageNd13: string;
  isSignND13Success: boolean;
  isSuccessCheckCondition: boolean;
  isDisableButtonCheck: boolean;
  isDisableNewButtonCheck: boolean;
  isShowSignLink: boolean;
  countFailOtp: number;
  contractType: ContractTypeEnum;
  dataTransfereeInfo: TransferInfo;
  dataTransferorInfo: TransferInfo;
  formAntd: any;
  deviceToken: string;
  interval: any;
  isOpenModalPdf: boolean;
  isSignSuccess: boolean;
  isTransfereeSignSuccess: boolean;
  isSuccessIsdn: boolean;
  isChangeInfoOcr: boolean;
  offlineCreatedList: ContractTypeEnum[];
  isCheckSuccessGetOTPCustomer: boolean;
  checkIsSuccessConfirmOTP: boolean;
  typeOfGenContract: ContractTypeEnum | '';
};

type Actions = {
  setCheckIsSuccessGetOTPCustomer: (data: boolean) => void;
  setCheckSubInfo: (data: boolean) => void;
  setSelectedRowKeys: (data: any) => void;
  setActiveKeyNd13: (data: string) => void;
  setImageNd13: (data: string) => void;
  setSignND13Success: (data: boolean) => void;
  setSuccessCheckCondition: (data: any) => void;
  setDisableButtonCheck: (data: any) => void;
  setDisableNewButtonCheck: (data: any) => void;
  setDataTransfereeInfo: (data: object) => void;
  setDataTransferorInfo: (data: object) => void;
  setIsShowSignLink: (data: boolean) => void;
  setCountFailOtp: (data: number) => void;
  setContractType: (type: ContractTypeEnum) => void;
  resetDataTransfereeInfo: () => void;
  resetDataTransferorInfo: () => void;
  setFormAntd: (data: any) => void;
  setDeviceToken: (data: string) => void;
  setIntervalApi: (data: any) => void;
  setOpenModalPdf: (data: boolean) => void;
  setSignSuccess: (data: boolean) => void;
  setTransfereeSignSuccess: (data: boolean) => void;
  resetGroupStore: () => void;
  setIsSuccessIsdn: (data: boolean) => void;
  setIsChangeInfoOcr: (data: boolean) => void;
  setCheckIsSuccessConfirmOTP: (data: boolean) => void;
  setOfflineCreatedList: (
    data: ContractTypeEnum | undefined,
    reset?: boolean
  ) => void;
  setTypeOfGenContract: (data: ContractTypeEnum) => void;
};
const dataTransfereeInfoDefault = {
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
const initialState: State = {
  checkSubInfoSuccess: false,
  selectedRowKeys: [],
  dataTransfereeInfo: dataTransfereeInfoDefault,
  dataTransferorInfo: dataTransfereeInfoDefault,
  isShowSignLink: false,
  countFailOtp: 0,
  contractType: ContractTypeEnum.XAC_NHAN,
  activeKeyNd13: '0',
  imageNd13: '',
  isSignND13Success: false,
  isSuccessCheckCondition: false,
  isDisableButtonCheck: true,
  isDisableNewButtonCheck: true,
  formAntd: null,
  deviceToken: '',
  interval: undefined,
  isOpenModalPdf: false,
  isSignSuccess: false,
  isTransfereeSignSuccess: false,
  isSuccessIsdn: false,
  isChangeInfoOcr: false,
  isCheckSuccessGetOTPCustomer: false,
  checkIsSuccessConfirmOTP: false,
  offlineCreatedList: [],
  typeOfGenContract: '',
};
const useOwnershipTransferStore = create<State & Actions>((set) => ({
  ...initialState,
  setTypeOfGenContract(data) {
    set(() => ({ typeOfGenContract: data }));
  },
  setCheckIsSuccessConfirmOTP(data) {
    set(() => ({ checkIsSuccessConfirmOTP: data }));
  },
  setCheckIsSuccessGetOTPCustomer(data) {
    set(() => ({ isCheckSuccessGetOTPCustomer: data }));
  },
  setCheckSubInfo(data) {
    set(() => ({ checkSubInfoSuccess: data }));
  },
  setSelectedRowKeys(value) {
    set(() => ({ selectedRowKeys: value }));
  },
  setIsShowSignLink(value) {
    set(() => ({ isShowSignLink: value }));
  },
  setCountFailOtp(value) {
    set(() => ({ countFailOtp: value }));
  },
  setContractType(value) {
    set(() => ({ contractType: value }));
  },
  setActiveKeyNd13(value) {
    set(() => ({ activeKeyNd13: value }));
  },
  setImageNd13(value) {
    set(() => ({ imageNd13: value }));
  },
  setSignND13Success(value) {
    set(() => ({ isSignND13Success: value }));
  },
  setSuccessCheckCondition(value) {
    set(() => ({ isSuccessCheckCondition: value }));
  },
  setDisableButtonCheck(value) {
    set(() => ({ isDisableButtonCheck: value }));
  },
  setDisableNewButtonCheck(value) {
    set(() => ({ isDisableNewButtonCheck: value }));
  },
  setDataTransfereeInfo(value) {
    set((state) => ({
      dataTransfereeInfo: { ...state.dataTransfereeInfo, ...value },
    }));
  },
  setDataTransferorInfo(value) {
    set((state) => ({
      dataTransferorInfo: { ...state.dataTransferorInfo, ...value },
    }));
  },
  resetDataTransfereeInfo() {
    set(() => ({
      dataTransfereeInfo: dataTransfereeInfoDefault,
      isSuccessCheckCondition: false,
      isDisableNewButtonCheck: true,
      isShowSignLink: false,
    }));
  },
  resetDataTransferorInfo() {
    set(() => ({
      dataTransferorInfo: dataTransfereeInfoDefault,
      isSuccessCheckCondition: false,
      isDisableButtonCheck: false,
    }));
  },
  setFormAntd(value) {
    set(() => ({ formAntd: value }));
  },
  setDeviceToken(value) {
    set(() => ({ deviceToken: value }));
  },
  setIntervalApi(value) {
    set(() => ({ interval: value }));
  },
  setOpenModalPdf(value) {
    set(() => ({ isOpenModalPdf: value }));
  },
  setSignSuccess(value) {
    set(() => ({ isSignSuccess: value }));
  },
  setTransfereeSignSuccess(value) {
    set(() => ({ isTransfereeSignSuccess: value }));
  },
  setIsSuccessIsdn(value) {
    set(() => ({ isSuccessIsdn: value }));
  },
  setIsChangeInfoOcr(value) {
    set(() => ({ isChangeInfoOcr: value }));
  },
  setOfflineCreatedList(value, reset) {
    set(({ offlineCreatedList }) => ({
      offlineCreatedList:
        !reset && value ? uniq([...offlineCreatedList, value]) : [],
    }));
  },
  resetGroupStore() {
    set(initialState);
  },
}));
export default useOwnershipTransferStore;
