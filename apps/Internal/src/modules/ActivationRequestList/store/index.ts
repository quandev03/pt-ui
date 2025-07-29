import { create } from 'zustand';
import { IGroupStore } from '../../CatrgoryReason/store';
import { ContentItem } from '../types';
import { FormInstance } from 'antd';
import { FieldErrorsType } from '@react/commons/types';

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
  formAntd: FormInstance | null;
  setFormAntd: (data: any) => void;
  deviceToken: string;
  setDeviceToken: (data: string) => void;
  isSignSuccess: boolean;
  setSignSuccess: (data: boolean) => void;
  isSignND13Success: boolean;
  setSignND13Success: (data: boolean) => void;
  interval: any;
  setIntervalApi: (data: any) => void;
  isOpenModalPdf: boolean;
  setOpenModalPdf: (data: boolean) => void;
  imageNd13: string;
  setImageNd13: (data: string) => void;
  activeKeyNd13: string;
  setActiveKeyNd13: (data: string) => void;
  dataActivationRequest: ContentItem;
  setDataActivationRequest: (data: object) => void;
  resetDataActivationRequest: () => void;
  // activeSubmitMore3: boolean;
  // setActiveSubmitMore3: (data: any) => void;
  countFailOtp: number;
  setCountFailOtp: (data: number) => void;
  isSuccessCheckCondition: boolean;
  setSuccessCheckCondition: (data: any) => void;
  isChangeValue: boolean;
  setIsChangeValue: (value: boolean) => void;
  isSignAgainFlag: boolean;
  setIsSignAgainFlag: (value: boolean) => void;
  isChangeName: boolean;
  setIsChangeName: (value: boolean) => void;
  isRefresh: boolean;
  setIsRefresh: (value: boolean) => void;
  isShowContract: boolean;
  setIsShowContract: (value: boolean) => void;
  isCheckUpdateSuccess: boolean;
  setIsCheckUpdateSuccess: (value: boolean) => void;
}

const dataActivateInfoDefault = {
  address: '',
  birthday: '',
  check_sendOTP: false,
  city: '',
  district: '',
  document: '',
  expiry: '',
  id: '',
  id_ekyc: '',
  issue_by: '',
  issue_date: '',
  list_phoneNumber: [],
  name: '',
  sex: '',
  ward: '',
  errors: [],
};

const dataActivationDefault = {
  id: '',
  empName: '',
  distributor: '',
  contractNo: '',
  isdn: '',
  name: '',
  birthDate: '',
  idNo: '',
  idType: '',
  custType: '',
  activeStatus: '',
  status: '',
  rejectedReason: '',
  approveUser: '',
  approveDate: '',
  approveStatus: '',
  approveStatusCheck: '',
  reasonReject: '',
  address: '',
  custNo: '',
  district: '',
  empUser: '',
  idExpireDate: '',
  idIssueDate: '',
  idIssueExpireDate: '',
  idIssuePlace: '',
  precinct: '',
  province: '',
  requestImageResponses: [],
};

export const useActiveSubscriptStore = create<IActiveSubscriptStore>((set) => ({
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
    set(() => ({ dataActivateInfo: dataActivateInfoDefault }));
  },
  isShowSignLink: false,
  setIsShowSignLink(value) {
    set(() => ({ isShowSignLink: value }));
  },
  resetGroupStore() {
    set(() => ({
      isShowSignLink: false,
      isSignSuccess: false,
      dataActivateInfo: dataActivateInfoDefault,
      isSuccessCheckCondition: false,
      isChangeName: false,
      isChangeValue: false,
      isSignAgainFlag: false,
      isRefresh: false,
      isShowContract: true,
      isCheckUpdateSuccess: false,
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
  dataActivationRequest: dataActivationDefault,
  setDataActivationRequest(value) {
    set((state) => ({
      dataActivationRequest: { ...state.dataActivationRequest, ...value },
    }));
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
  resetDataActivationRequest() {
    set(() => ({ dataActivationRequest: dataActivationDefault }));
  },
  countFailOtp: 0,
  setCountFailOtp(value) {
    set(() => ({ countFailOtp: value }));
  },
  isSuccessCheckCondition: false,
  setSuccessCheckCondition(value) {
    set(() => ({ isSuccessCheckCondition: value }));
  },
  isChangeValue: false,
  setIsChangeValue(value) {
    set(() => ({ isChangeValue: value }));
  },
  isSignAgainFlag: false,
  setIsSignAgainFlag(value) {
    set(() => ({ isSignAgainFlag: value }));
  },
  isChangeName: false,
  setIsChangeName(value) {
    set(() => ({ isChangeName: value }));
  },
  isRefresh: false,
  setIsRefresh(value) {
    set(() => ({ isRefresh: value }));
  },
  isShowContract: true,
  setIsShowContract(value) {
    set(() => ({ isShowContract: value }));
  },
  isCheckUpdateSuccess: false,
  setIsCheckUpdateSuccess(value) {
    set(() => ({ isCheckUpdateSuccess: value }));
  },
}));

export const useGroupStore = create<IGroupStore>((set) => ({
  isValuesChanged: false,
  searchValue: '',

  setIsValuesChanged(isChanged) {
    set(() => ({ isValuesChanged: isChanged }));
  },
  resetGroupStore() {
    set(() => ({
      isValuesChanged: false,
    }));
  },
  setSearchValue(text) {
    set(() => ({ searchValue: text }));
  },
}));
