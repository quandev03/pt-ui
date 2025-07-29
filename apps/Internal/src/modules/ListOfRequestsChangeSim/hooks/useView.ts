import { axiosClient } from 'apps/Internal/src/service';
import { useMutation } from '@tanstack/react-query';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';
import useStoreListOfRequestsChangeSim from '../store';
import { useSearchRequestAdmin } from './useSearchRequestAdmin';
import { ImageCode, ImageType } from '@react/constants/app';

export interface IChangeSimDetail {
  actionAllow: number;
  dataContract: DataContract;
  imageDtos: ImageDto[];
  otherData: any;
  regularContacts: any;
  simChangeRequestDto: SimChangeRequestDto;
}

export interface DataContract {
  address: string;
  balance: any;
  ccdvvt: string;
  changeSimNo: string;
  changeToEsim: boolean;
  changeToPhysicalSim: boolean;
  country: string;
  cskhSignatureDetail: string;
  cskhSignatureImage: string;
  customerName: string;
  customerNo: string;
  dataPackage: any;
  dateOfBirth: string;
  dateOfIssue: string;
  email: any;
  errorSim: boolean;
  feMale: boolean;
  firstSerialSimNew: string;
  firstSerialSimOld: string;
  gurantee: boolean;
  idNo: string;
  lastCardRechargeTime: any;
  lastCardRechargeValue: any;
  male: boolean;
  originPhoneNumber: string;
  other: boolean;
  otherContact: any;
  phoneNumber: string;
  placeOfIssue: string;
  reGularPhoneNumbers: ReGularPhoneNumber[];
  secondSerialSimNew: string;
  secondSerialSimOld: string;
  signature: any;
  type: string;
  typeSim: string;
  valueAddedService: any;
}

export interface ReGularPhoneNumber {
  phoneNumber: any;
}

export interface ImageDto {
  createdBy: string;
  createdDate: string;
  id: number;
  imageCode?: string;
  imagePath: string;
  imageType: string;
  modifiedBy: string;
  modifiedDate: string;
  requestId: string;
}

export enum StatusChangeSimEnum {
  PENDING = 0, // Chưa xử lý
  APPROVED = 1, // Đã xử lý (Đã phê duyệt)
  FAILED = 2, // Xử lý thất bại
  TIMEOUT = 3, // Hết hạn
  REJECTED = 4, // Từ chối
}

export interface SimChangeRequestDto {
  address: string;
  createdBy: string;
  createdDate: string;
  deliveryId: any;
  deliveryMethod: string;
  deliveryPartner: any;
  deliveryStatus: any;
  district: string;
  email: any;
  feeAmount: number;
  fullName: string;
  id: string;
  isdn: number;
  lpaData: any;
  modifiedBy: string;
  modifiedDate: string;
  newImsi: number;
  newSerial: number;
  note: any;
  oldSerial: number;
  otherData: any;
  payStatus: number;
  payTransactionId: string;
  phoneNumber: string;
  precinct: string;
  processDate: any;
  reasonCode: string;
  reasonNote: any;
  receiptMethod: any;
  receiverAddress: string;
  receiverBirth: any;
  receiverName: string;
  receiverPhone: string;
  receiverProvince: string;
  receiverProvinceName: string;
  receiverSex: any;
  regularContacts: any;
  rejectReasonCode: any;
  requestSimType: string;
  requestType: string;
  saleOrderNo: string;
  shopCode: any;
  status: StatusChangeSimEnum;
  stockId: string;
  storeAddress: any;
  subId: number;
}

const fetcher = async (id: string) => {
  return await axiosClient.get<string, IChangeSimDetail>(
    `${prefixCustomerService}/change-sim/detail/${id}`
  );
};

export const useView = () => {
  const { formAntd: form } = useStoreListOfRequestsChangeSim();
  const { mutate: mutateGetDetail } = useSearchRequestAdmin();
  const { setProvinceSelected, setDistrictSelected, setDataRejectForm } =
    useStoreListOfRequestsChangeSim();
  return useMutation({
    mutationFn: fetcher,
    onSuccess: (res) => {
      form.setFieldsValue({
        actionAllow: res.actionAllow,
      });
      if (res?.imageDtos) {
        const getImageUrl = (imageType: string, imageCode?: string) => {
          const listImg = res.imageDtos || [];
          const image = listImg.find(
            (item: any) =>
              item.imageType === imageType &&
              (imageCode ? item.imageCode === imageCode : true)
          );
          return image ? image.imagePath : '';
        };
        form.setFieldsValue({
          cardFront: getImageUrl(ImageType.CCCD, ImageCode.FRONT),
          cardBack: getImageUrl(ImageType.CCCD, ImageCode.BACK),
          portrait:
            getImageUrl(ImageType.CCCD, ImageCode.PORTRAIT) ||
            getImageUrl(ImageType.CCCD, ImageCode.INCLINE_PORTRAIT),
          cardContract: getImageUrl(ImageType.HD),
        });
      }
      if (res?.simChangeRequestDto) {
        const info = res.simChangeRequestDto;
        mutateGetDetail(info.subId.toString());
        if (info.payStatus === 1) {
          //đã thanh toán
          form.setFieldsValue({
            paySuccess: 'true',
          });
        }
        setProvinceSelected(info.receiverProvince);
        setDistrictSelected(info.district);
        form.setFieldsValue({
          address: info.address,
          simType: info.requestSimType,
          stockId: info.stockId ? Number(info.stockId) : '',
          serial: info.newSerial,
          email: info.email,
          deliveryMethod: info.deliveryMethod,
          reason: info.reasonCode,
          feeAmount: info.feeAmount,
          feeAmountCache: info.feeAmount,
          saleOrderNo: info.saleOrderNo,
          payStatus: info.payStatus?.toString(),
          note: info.note,
          receiverName: info.receiverName,
          receiverPhone: info.receiverPhone,
          receiverAddress: info.receiverAddress ?? info.storeAddress,
          storeAddress: info.storeAddress ?? info.receiverAddress,
          province: info.receiverProvince,
          district: info.district,
          precinct: info.precinct,
          contractId: info.id,
          status: info.status,
          requestType: info.requestType,
          receiptMethod: info.receiptMethod,
          phoneNumber: info.phoneNumber,
          isdn: info.isdn,
          receiverProvinces: info.receiverProvinceName,
          districtCode: info.district,
          lpaData: info.lpaData,
          receiverProvince: info.receiverProvince
        });
        setDataRejectForm({
          deliveryMethod: info.deliveryMethod,
          receiverAddress: info.receiverAddress,
          receiverProvince: info.receiverProvince,
          storeAddress: info.storeAddress,
          receiptMethod: info.receiptMethod,
          receiverPhone: info.receiverPhone,
        })
      }

      if (res?.dataContract) {
        form.setFieldsValue({
          dataContract: res?.dataContract,
        });
      }

      if (res?.otherData) {
        const otherData = res.otherData;
        form.setFieldsValue({
          balance: otherData?.remainingBalance,
          dataPackage: otherData?.packageCode,
          valueAddedService: otherData?.currentVASService,
          lastCardRechargeTime: otherData?.lastTopUpDate,
          lastCardRechargeValue: otherData?.lastTopUpValue,
        });
      }
      if (res?.regularContacts) {
        const regularContacts = res.regularContacts;
        form.setFieldsValue({
          phoneNumber1: regularContacts?.[0],
          phoneNumber2: regularContacts?.[1],
          phoneNumber3: regularContacts?.[2],
          phoneNumber4: regularContacts?.[3],
          phoneNumber5: regularContacts?.[4],
        });
      }
    },
  });
}