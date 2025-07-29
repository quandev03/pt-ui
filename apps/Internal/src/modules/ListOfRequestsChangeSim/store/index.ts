import dayjs from 'dayjs';
import { create } from 'zustand';
import { DocumentTypeEnum, IPayloadReject } from '../types';
export interface ListOfRequestsChangeSimStore {
  changeSimCode: string;
  setChangeSimCode: (changeSimCode?: string) => void;
  isValuesChanged: boolean;
  setIsValuesChanged: (isChanged: boolean) => void;
  formAntd: any;
  setFormAntd: (data: any) => void;
  checkSubInfoSuccess: boolean;
  setCheckSubInfo: (data: boolean) => void;
  isSignSuccess: boolean;
  setSignSuccess: (data: boolean) => void;
  isDisabledContract: boolean;
  setIsDisabledContract: (isChanged: boolean) => void;
  interval: any;
  setIntervalApi: (data: any) => void;
  isOpenModalPdf: boolean;
  setOpenModalPdf: (data: boolean) => void;
  payData: string;
  setPayData: (data: string) => void;
  timeout: any;
  setTimeoutCheck: (data: any) => void;
  enableCheck: boolean;
  setEnableCheck: (data: boolean) => void;
  disableForm: boolean;
  setDisableForm: (data: boolean) => void;
  isOpenModalReason: boolean;
  setOpenModalReason: (data: boolean) => void;
  resetDataActivateInfo: () => void;
  resetGroupStore: () => void;
  provinceSelected: string;
  setProvinceSelected: (provinceSelected: string) => void;
  districtSelected: string;
  setDistrictSelected: (districtSelected: string) => void;
  documentType: string;
  setDocumentType: (documentType: DocumentTypeEnum) => void;
  lpd: null | string,
  dataRejectForm: IPayloadReject,
  setDataRejectForm: (data: IPayloadReject) => void
  setLpd: (lpd: null | string) => void
  isPendingSerialNew: boolean;
  setIsPendingSerialNew: (isPendingSerialNew: boolean) => void
}

const useStoreListOfRequestsChangeSim = create<ListOfRequestsChangeSimStore>(
  (set) => ({
    changeSimCode: '',
    provinceSelected: '',
    districtSelected: '',
    lpd: null,
    setLpd(lpd) {
      set({ lpd });
    },
    setProvinceSelected(provinceSelected) {
      set(() => ({ provinceSelected }));
    },
    setDistrictSelected(districtSelected) {
      set(() => ({ districtSelected }));
    },
    documentType: '',
    setDocumentType(documentType) {
      set(() => ({ documentType }));
    },
    setChangeSimCode(value) {
      set(() => ({
        changeSimCode: value
          ? value
          : dayjs().format('DDMMYY') + dayjs().valueOf().toString().slice(-6),
      }));
    },
    isValuesChanged: false,
    setIsValuesChanged(isChanged) {
      set(() => ({ isValuesChanged: isChanged }));
    },
    formAntd: null,
    setFormAntd(value) {
      set(() => ({ formAntd: value }));
    },
    checkSubInfoSuccess: false,
    setCheckSubInfo(data) {
      set(() => ({ checkSubInfoSuccess: data }));
    },
    isSignSuccess: false,
    setSignSuccess(value) {
      set(() => ({ isSignSuccess: value }));
    },
    isDisabledContract: true,
    setIsDisabledContract(value) {
      set(() => ({ isDisabledContract: value }));
    },
    interval: undefined,
    setIntervalApi(value) {
      set(() => ({ interval: value }));
    },
    isOpenModalPdf: false,
    setOpenModalPdf(value) {
      set(() => ({ isOpenModalPdf: value }));
    },
    payData: '',
    setPayData(value) {
      set(() => ({ payData: value }));
    },
    timeout: undefined,
    setTimeoutCheck(value) {
      set(() => ({ timeout: value }));
    },
    enableCheck: false,
    setEnableCheck(data) {
      set(() => ({ enableCheck: data }));
    },
    disableForm: false,
    setDisableForm(data) {
      set(() => ({ disableForm: data }));
    },
    isOpenModalReason: false,
    setOpenModalReason(data) {
      set(() => ({ isOpenModalReason: data }));
    },
    dataRejectForm: {} as IPayloadReject,
    setDataRejectForm(data) {
      set(() => ({ dataRejectForm: data }));
    },
    resetDataActivateInfo() {
      set(() => ({
        isDisabledContract: true,
        isShowSignLink: false,
        isSignSuccess: false,
      }));
    },
    isPendingSerialNew: false,
    setIsPendingSerialNew(isPendingSerialNew) {
      set(() => ({ isPendingSerialNew: isPendingSerialNew }));
    },
    resetGroupStore() {
      set(() => ({
        payData: '',
        isValuesChanged: false,
        checkSubInfo: false,
        isSignSuccess: false,
        isPendingSerialNew: false,
        isDisabledContract: true,
        disableForm: false,
        enableCheck: false,
        isOpenModalReason: false,
        timeout: undefined,
        changeSimCode: '',
        formAntd: null,
        checkSubInfoSuccess: false,
        isOpenModalPdf: false,
        interval: undefined,
        lpd: null
      }));
    },
  })
);
export default useStoreListOfRequestsChangeSim;
