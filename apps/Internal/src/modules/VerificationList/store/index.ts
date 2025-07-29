import { create } from 'zustand';
import { IOption, ISubDocument } from '../types';
import { IFieldErrorsItem } from '@react/commons/types';
import { Key } from 'react';

const defaultSubDocument: ISubDocument = {
  contractNo: '',
  customerCode: '',
  phoneNumber: '',
  serialSim: '',
  subDocumentImageResponses: [],
  uploadDocumentDate: '',
  document: '',
  name: '',
  id: '',
  issue_by: '',
  issue_date: null,
  birthday: '',
  sex: '',
  address: '',
  city: '',
  district: '',
  ward: '',
  expiry: '',
  nationality: '',
  otpStatus: '',
  videoCallStatus: '',
  videoCallUser: '',
  approveStatus: '',
  assignUserName: '',
  approveNumber: '',
  approveRejectReasonCode: null,
  approveNote: null,
  approveDate: null,
  auditStatus: '',
  auditRejectReasonCode: null,
  listErrorCode8Condition: [],
  idExpireDateNote: null,
  subDocumentId: '',
  packagePlan: '',
  actionAllow: 1,
  createdContractDate: '',
  listUpdateApproveDoc: [],
  isdn: '',
};
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
};

export interface ICensorshipStore {
  isAdmin: boolean;
  isDisabledContract: boolean;
  isSignSuccess: boolean;
  approveStatusList: IOption[];
  auditStatusList: IOption[];
  dataActivateInfo: {
    address: string;
    birthday: string;
    check_sendOTP: boolean;
    city: string;
    district: string;
    document: string;
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
  isClickCheckInfo: boolean;
  setIsClickCheckInfo: (isClickCheckInfo: boolean) => void;
  isOffSign: boolean;
  setIsOffSign: (isOffSign: boolean) => void;
  subDocDetail: ISubDocument;
  setSubDocDetail: (subDocDetail: ISubDocument) => void;
  isChangeImage: boolean;
  setIsChangeImage: (isChange: boolean) => void;
  formAntd: any;
  setFormAntd: (data: any) => void;
  isOpenModalPdf: boolean;
  setOpenModalPdf: (data: boolean) => void;
  deviceToken: string;
  setDeviceToken: (data: string) => void;
  interval: any;
  setIntervalApi: (data: any) => void;
  activeKeyNd13: string;
  setActiveKeyNd13: (data: string) => void;
  isSignND13Success: boolean;
  setSignND13Success: (data: boolean) => void;
  imageNd13: string;
  setImageNd13: (data: string) => void;
  selectedRowKeys: Key[];
  setSelectedRowKeys: (data: any) => void;
  isDisableSync: boolean;
  setIsDisableSync: (isDisableSync: boolean) => void;
  criteriaErrList: IFieldErrorsItem[];
  setCriteriaErrList: (errList: IFieldErrorsItem[]) => void;
  isClickSearch: number;
  setIsClickSearch: (isClickSearch: number) => void;
  iframeSrc: string;
  setIframeSrc: (iframeSrc: string) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  setIsDisabledContract: (isDisabledContract: boolean) => void;
  setIsSignSuccess: (isSignSuccess: boolean) => void;
  setApproveStatusList: (approveStatusList: IOption[]) => void;
  setAuditStatusList: (auditStatusList: IOption[]) => void;
  setDataActivateInfo: (data: object) => void;
  resetDataActivateInfo: () => void;
  resetStore: () => void;
  resetGroupStore: () => void;
  isUpdateCustomerInfoDoc: boolean;
  setIsUpdateCustomerInfoDoc: (isUpdateCustomerInfoDoc: boolean) => void;
  isCheckConditionSuccess: boolean;
  setIsCheckConditionSuccess: (isCheckConditionSuccess: boolean) => void;
  isUpdateFieldNeedSignAgain: boolean;
  setIsUpdateFieldNeedSignAgain: (isUpdateFieldNeedSignAgain: boolean) => void;
  newSignContractUrl: string;
  setNewSignContractUrl: (newSignContractUrl: string) => void;
  contractUploadType: number | null;
  setContractUploadType: (contractUploadType: number | null) => void;
  checkConditionErrors: IFieldErrorsItem[];
  setCheckConditionErrors: (errors: IFieldErrorsItem[]) => void;
  isDisUploadImage: boolean;
  setIsDisUploadImage: (isDisUploadImage: boolean) => void;
  listErr: IFieldErrorsItem[];
  setListErr: (listErr: IFieldErrorsItem[]) => void;
}
const useCensorshipStore = create<ICensorshipStore>((set) => ({
  isAdmin: false,
  isDisabledContract: true,
  isSignSuccess: false,
  approveStatusList: [],
  auditStatusList: [],
  dataActivateInfo: dataActivateInfoDefault,
  isClickCheckInfo: false,
  setIsClickCheckInfo(isClickCheckInfo) {
    set(() => ({ isClickCheckInfo: isClickCheckInfo }));
  },
  isOffSign: false,
  setIsOffSign(isOffSign) {
    set(() => ({ isOffSign: isOffSign }));
  },
  subDocDetail: defaultSubDocument,
  setSubDocDetail(subDocDetail) {
    set(() => ({ subDocDetail: subDocDetail }));
  },
  isChangeImage: false,
  setIsChangeImage(isChange) {
    set(() => ({ isChangeImage: isChange }));
  },
  formAntd: null,
  setFormAntd(value) {
    set(() => ({ formAntd: value }));
  },
  deviceToken: '',
  setDeviceToken(value) {
    set(() => ({ deviceToken: value }));
  },
  isOpenModalPdf: false,
  setOpenModalPdf(value) {
    set(() => ({ isOpenModalPdf: value }));
  },
  interval: undefined,
  setIntervalApi(value) {
    set(() => ({ interval: value }));
  },
  activeKeyNd13: '0',
  setActiveKeyNd13(value) {
    set(() => ({ activeKeyNd13: value }));
  },
  isSignND13Success: false,
  setSignND13Success(value) {
    set(() => ({ isSignND13Success: value }));
  },
  imageNd13: '',
  setImageNd13(value) {
    set(() => ({ imageNd13: value }));
  },
  selectedRowKeys: [],
  setSelectedRowKeys(value) {
    set(() => ({ selectedRowKeys: value }));
  },
  isDisableSync: true,
  setIsDisableSync(isDisableSync) {
    set(() => ({ isDisableSync: isDisableSync }));
  },
  criteriaErrList: [],
  setCriteriaErrList(errList) {
    set(() => ({ criteriaErrList: errList }));
  },
  isClickSearch: 0,
  setIsClickSearch(isClickSearch) {
    set(() => ({ isClickSearch: isClickSearch }));
  },
  iframeSrc: '',
  setIframeSrc(iframeSrc) {
    set(() => ({ iframeSrc: iframeSrc }));
  },
  setIsAdmin(isAdmin) {
    set(() => ({ isAdmin: isAdmin }));
  },
  setIsDisabledContract(isDisabledContract) {
    set(() => ({ isDisabledContract: isDisabledContract }));
  },
  setIsSignSuccess(isSignSuccess) {
    set(() => ({ isSignSuccess: isSignSuccess }));
  },
  setApproveStatusList(approveStatusList) {
    set(() => ({ approveStatusList: approveStatusList }));
  },
  setAuditStatusList(auditStatusList) {
    set(() => ({ auditStatusList: auditStatusList }));
  },
  setDataActivateInfo(value) {
    set((state) => ({
      dataActivateInfo: { ...state.dataActivateInfo, ...value },
    }));
  },
  resetDataActivateInfo() {
    set(() => ({
      dataActivateInfo: dataActivateInfoDefault,
      isShowSignLink: false,
    }));
  },
  resetStore() {
    set(() => ({
      isAdmin: false,
    }));
  },
  resetGroupStore() {
    set(() => ({
      isShowSignLink: false,
      isSignSuccess: false,
      dataActivateInfo: dataActivateInfoDefault,
      isDisabledContract: true,
      isChangeImage: false,
      criteriaErrList: [],
      activeKeyNd13: '0',
      isSignND13Success: false,
      isClickCheckInfo: false,
      isOffSign: false,
      isUpdateFieldNeedSignAgain: false,
      isUpdateCustomerInfoDoc: false,
      isSignOff: false,
      newSignContractUrl: '',
      listErr: [],
    }));
  },
  isUpdateCustomerInfoDoc: false,
  setIsUpdateCustomerInfoDoc(isUpdateCustomerInfoDoc) {
    set(() => ({ isUpdateCustomerInfoDoc: isUpdateCustomerInfoDoc }));
  },
  isCheckConditionSuccess: false,
  setIsCheckConditionSuccess(isCheckConditionSuccess) {
    set(() => ({ isCheckConditionSuccess: isCheckConditionSuccess }));
  },
  isUpdateFieldNeedSignAgain: false,
  setIsUpdateFieldNeedSignAgain(isUpdateFieldNeedSignAgain) {
    set(() => ({ isUpdateFieldNeedSignAgain: isUpdateFieldNeedSignAgain }));
  },
  newSignContractUrl: '',
  setNewSignContractUrl(newSignContractUrl) {
    set(() => ({ newSignContractUrl: newSignContractUrl }));
  },
  contractUploadType: null,
  setContractUploadType(contractUploadType) {
    set(() => ({ contractUploadType: contractUploadType }));
  },
  checkConditionErrors: [],
  setCheckConditionErrors(errors) {
    set(() => ({ checkConditionErrors: errors }));
  },
  isDisUploadImage: false,
  setIsDisUploadImage(isDisUploadImage) {
    set(() => ({ isDisUploadImage: isDisUploadImage }));
  },
  listErr: [],
  setListErr(listErr) {
    set(() => ({ listErr: listErr }));
  },
}));
export default useCensorshipStore;
