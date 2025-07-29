import { IParamsRequest, ModelStatus } from '@react/commons/types';
import { Dispatch, SetStateAction } from 'react';

export interface ModalProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export interface IdentificationModalProps extends ModalProps {
  callback?: () => void;
}

export interface FileModalProps extends ModalProps {
  name: string;
  urlCommitmentContract?: string;
}

export interface InformationChangeImageProps {
  label: string;
  src: string;
  date?: string;
  status?: boolean;
}

export interface SubscriptionRequest extends IParamsRequest {
  isdn?: string;
  serial?: string;
  idNo?: string;
  isAdmin?: boolean;
  isSearch?: boolean;
}

export interface CustomerInfoRequest {
  id: string;
  idNo: string;
}

export interface NoteRequest {
  id: string;
  note: string;
}

export interface ZoneRequest {
  id: string;
  zone: string;
  reasonId: string;
  reasonText?: string;
}

export interface PackageRequest {
  subId: string;
  actionCode: ImpactType;
  packageId: string;
  packageCode: string;
  cycle: number;
  unit: string;
  reasonCode: string;
  otherReason?: string;
}

export interface SubscriberRequest {
  subId: string;
  actionCode: ImpactType;
  reasonCode: string;
  otherReason?: string;
  message?: string;
}

export interface CancelSubscriberRequest {
  data: {
    subId: string;
    reasonCode: string;
    otherReason?: string;
  };
  confirmationLetter: File;
}

export interface PromotionRequest {
  subId: string;
  actionCode: ImpactType;
  reasonCode: string;
  otherReason?: string;
}

export interface LastFiveCallResquest {
  isdn: string;
  phoneNumber1: string;
  phoneNumber2: string;
  phoneNumber3: string;
  phoneNumber4: string;
  phoneNumber5: string;
}

export interface LastFiveCallError {
  phoneNumber1: LastFiveCallErrorItem;
  phoneNumber2: LastFiveCallErrorItem;
  phoneNumber3: LastFiveCallErrorItem;
  phoneNumber4: LastFiveCallErrorItem;
  phoneNumber5: LastFiveCallErrorItem;
}

export interface LastFiveCallErrorItem {
  status?: '' | 'error' | 'success' | 'warning' | 'validating';
  help?: string;
}

export interface ImpactRequest {
  subId: string;
  listSubID: string[];
  actionCode: ImpactType;
  reasonCode: string;
  reasonNote: string;
  description?: string;
}

export interface ImpactByFileRequest {
  metaData: {
    actionCode: ImpactType;
    reasonCode: string;
    reasonNote: string;
    description?: string;
  };
  actionFile: File;
}

export interface EmailRequest {
  idSub: string;
  email: string;
  qrCode: string;
}

export interface ImpactHistoryRequest extends IParamsRequest {
  fromDate: string;
  toDate: string;
  actionCode?: ImpactType;
  empName?: string;
}

export interface PackageHistoryRequest extends IParamsRequest {
  typeDate: number;
  fromDate: string;
  toDate: string;
  actionCode?: ImpactType;
  userName?: string;
}

export interface PackageCapacityRequest extends IParamsRequest {
  typeDate: number;
  fromDate: string;
  toDate: string;
  packCode?: string;
}

export interface SubscriberNoImpactRequest extends IParamsRequest {
  fromDate: string;
  toDate: string;
  searchText?: string;
}

export interface SubscriberImpactByFileRequest extends IParamsRequest {
  fromDate: string;
  toDate: string;
  actionType: ImpactType;
  searchText?: string;
}

export interface FeedbackHistoryRequest extends IParamsRequest {
  isdn?: string;
}
export interface SmsHistoryRequest extends IParamsRequest {
  id?: string;
  fromDate: string;
  toDate: string;
}

export type Subscription = {
  id: number;
  isdn: number;
  serial: string;
  idNo: string;
  name: string;
  activeDate: string;
  status: ModelStatus;
  statusApproval: number;
  activeStatus: number;
  appStatus: string;
  actionAllow: ImpactStatus;
};

export type SubscriptionDetail = {
  GTGTservice: string;
  accountBalanceChange: string;
  actionAllow: ImpactStatus;
  actionHistory: string;
  activeDate: string;
  activeStatus: number;
  address: string;
  ageSub: string;
  appObject: string;
  appRegStatus: string;
  approvalStatus: number;
  bandwidthReductionHistory: string;
  billAdjustmentHistory: string;
  birthDate: string;
  complaintHistory: string;
  contractNo: string;
  criterion: number;
  description: string;
  device: string;
  enterpriseName: string;
  fileContract: string;
  harassmentHistory: string;
  hlr: string;
  hlrReset: string;
  id: number;
  idExpireDate: string;
  idIssueDate: string;
  idIssuePlace: string;
  idNo: string;
  idType: string;
  imageInquiry: string;
  inforNormalizationStatus: number;
  isdn: number;
  kit: string;
  kitDate: string;
  kitTypeId: number;
  messageHistory1414: string;
  name: string;
  ocs: string;
  packageRegistrationHistory: string;
  permanentAddress: string;
  pinChange: string;
  promotionHistory: string;
  qrCode: string;
  reasonActiveStatus: string;
  reasonCriterion: string[];
  recentContacts: string;
  registerPromStatus: number;
  regulation13: string;
  representativeName: string;
  serial: string;
  serviceChange: string;
  servicePackage: string;
  serviceRegistrationHistory: string;
  serviceTermination: string;
  sex: string;
  simType: string;
  smsHistory: string;
  status: ModelStatus;
  statusC06: number;
  taxCode: string;
  topUpErrorRemoval: string;
  topUpHistory: string;
  userFeedback: string;
  vasService: string;
  zoneChangeHistory: string;
  videoCallStatus: boolean;
};

export type ImpactHistory = {
  actionCode: ImpactType;
  actionDate: string;
  description: string;
  empCode: string;
  id: number;
  reasonName: string;
  reasonNote: string;
};

export type InfoChange = {
  isdn: string;
  serial: string;
  fileList: string[];
  ownershipTransferContract: string;
  olds: InfoChangeItem;
  news: {
    statusAddress: boolean;
    statusBackId: boolean;
    statusBirthDate: boolean;
    statusDistrict: boolean;
    statusFrontId: boolean;
    statusIdIssueDate: boolean;
    statusIdIssuePlace: boolean;
    statusIdNo: boolean;
    statusIdType: boolean;
    statusName: boolean;
    statusPortrait: boolean;
    statusPrecinct: boolean;
    statusProvince: boolean;
    statusSex: boolean;
    //--------
    contract: string;
    nd13Contract: string;
    ownershipCommitment: string;
    statusOTP: string;
    reasonOTP: string;
  } & InfoChangeItem;
};

export type InfoChangeItem = {
  address: string;
  backId: string;
  birthDate: string;
  district: string;
  frontId: string;
  idIssueDate: string;
  idIssuePlace: string;
  idNo: string;
  idType: string;
  name: string;
  portrait: string;
  precinct: string;
  province: string;
  sex: string;
  timeBackId: string;
  timeFrontId: string;
  timePortrait: string;
  videoCallCaptureImage: string,
  timeVideoCallCaptureImage: string
};

export type SubscriberCurrentStatus = {
  activeStatusTwoWay: string;
  msisdn: string;
  imsi: string;
  cityLoc: string;
  profile: string;
  accCreDdt: string;
  dTac: string;
  dTmc: string;
  aLock: string;
  firstCal: string;
  dTr: string;
  lstReldt: string;
  lstUpcdt: string;
  prepaid: string;
  credit: string;
  admScrs: string;
  dTin: string;
  allowP2P: string;
  aCurSta: string;
  langCur: string;
};

export type PackageRegis = {
  packageId: string;
  packageCode: string;
  cycle: number;
  unit: string;
  price: number;
};

export type PackageCapacity = {
  packCode: string;
  packName: string;
  remaining: number;
  total: number;
  unit: string;
  startDate: string;
  endDate: string;
};

export type SubscriberNoImpact = {
  id: number;
  isdn: number;
  subId: string;
  name: string;
  actionUser: string;
  actionDate: string;
  reasonName: string;
  reasonNote: string;
  description: string;
};

export type SubscriberImpactByFile = {
  actionType: ImpactType;
  createdBy: string;
  createdDate: string;
  executionDate: string;
  failedCount: number;
  fileName: string;
  modifiedDate: string;
  resultPathFile: string;
  status: ModelStatus;
  successCount: number;
  totalRecord: number;
  uploadPathFile: string;
  reasonName: string;
  reasonNote: string;
};

export type SearchImage = {
  backId: string;
  fileContract: string;
  fileRegulation13: string;
  frontId: string;
  portrait: string;
  timeBackId: string;
  timeFrontId: string;
  timePortrait: string;
  fileCommitmentContract: string;
  videoCallCapture?: string;
  timeVideoCallCapture?: string
};

export type FeedbackHistory = {
  approvalDepartment: string;
  content: string;
  createdDate: string;
  deadline: string;
  department: string;
  feedbackType: string;
  id: number;
  priorityLevel: string;
  processor: string;
  status: string;
};

export type SmsHistory = {
  id: number;
  srcAddr: string;
  desAddr: string;
  sendTime: string;
  receiverTime: string;
  smsContent: string;
};

export enum ImpactStatus {
  OPEN = 1,
  BLOCK = 0,
}

export enum PromotionStatus {
  REGISTER = 1,
  CANCEL = 0,
}

export enum ImpactType {
  ACTIVE = 'ACTIVE',
  CHANGE_SIM = 'CHANGE_SIM',
  CHANGE_INFO = 'CHANGE_INFO',
  BLOCK_1_WAY = 'BLOCK_1_WAY',
  BLOCK_2_WAY = 'BLOCK_2_WAY',
  OPEN_1_WAY = 'OPEN_1_WAY',
  OPEN_2_WAY = 'OPEN_2_WAY',
  REGISTER_PACKAGE = 'REGISTER_PACKAGE',
  CANCEL_PACKAGE = 'CANCEL_PACKAGE',
  BLOCK_ACTION = 'BLOCK_ACTION',
  OPEN_ACTION = 'OPEN_ACTION',
  CHANGE_ZONE = 'CHANGE_ZONE',
  REGISTER_PROM = 'REGISTER_PROM',
  CANCEL_PROM = 'CANCEL_PROM',
  APPROVE = 'APPROVE',
  OWNERSHIP_TRANSFER = 'OWNERSHIP_TRANSFER',
}

export enum PackageDateType {
  START = '0',
  END = '1',
  IMPLEMENT = '2',
}

export enum SimType {
  PHYSICAL = '1',
  ESIM = '2',
}
