import { DateFormat } from '@react/constants/app';
import { prefixEventService } from '@react/url/app';
import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import dayjs from 'dayjs';
import useStoreBusinessManagement from '../store';

const fetcher = async (id: string) => {
  return await axiosClient.get<any, any>(
    `${prefixEventService}/audit-logs/${id}`
  );
};
const getDifferentKeys = (preValue: any, postValue: any) => {
  const differences: string[] = [];
  const keys = new Set([...Object.keys(postValue)]);
  keys.forEach((key) => {
    if (Array.isArray(preValue[key]) && Array.isArray(postValue[key])) {
      if (
        preValue[key].length !== postValue[key].length ||
        !preValue[key].every((item: any) => postValue[key].includes(item))
      ) {
        differences.push(key);
      }
    } else if (preValue[key] !== postValue[key]) {
      differences.push(key);
    }
  });
  return differences;
};
export const useViewHistory = () => {
  const { formAntd: form, setChangedFields } = useStoreBusinessManagement();
  return useMutation({
    mutationFn: fetcher,
    onSuccess: (res) => {
      form.setFieldsValue({
        taxCode: res.postValue.taxCode,
        enterpriseName: res.postValue.enterpriseName,
        phone: res.postValue.enterprisePhone,
        enterpriseEmail: res.postValue.enterpriseEmail,
        address: res.postValue.enterpriseAddress,
        enterpriseProvince: res.postValue.enterpriseProvince,
        enterpriseDistrict: res.postValue.enterpriseDistrict,
        enterprisePrecinct: res.postValue.enterprisePrecinct,
        establishmentDate: res.postValue.establishmentDate
          ? dayjs(res.postValue.establishmentDate, DateFormat.DATE_ISO)
          : undefined,
        contractDate: res.postValue.contractDate
          ? dayjs(res.postValue.contractDate, DateFormat.DATE_ISO)
          : undefined,
        contractNumber: res.postValue.contractNumber,
        contractFilePath: res.postValue.contractFilePath,
        licenseFilePath: res.postValue.licenseFilePath,
        note: res.postValue.note,
        supervisorId: res.postValue.supervisorId,
        amEmployeeIdList: res.postValue.amEmployeeIdList,
        status: res.status === 1 ? true : false,
        cardFrontView: res.postValue.representativeFrontImgPath,
        cardBackView: res.postValue.representativeBackImgPath,
        portraitView: res.postValue.representativePortraitImgPath,
        representativeIdType: res.postValue.representativeIdType,
        representativeIdNumber: res.postValue.representativeIdNumber,
        representativeIdIssueDate: res.postValue.representativeIdIssueDate
          ? dayjs(res.postValue.representativeIdIssueDate, DateFormat.DATE_ISO)
          : undefined,
        representativeGender: res.postValue.representativeGender,
        representativeName: res.postValue.representativeName,
        representativeIdIssuePlace: res.postValue.representativeIdIssuePlace,
        representativeBirthDate: res.postValue.representativeBirthDate
          ? dayjs(res.postValue.representativeBirthDate, DateFormat.DATE_ISO)
          : undefined,
        representativePermanentAddress:
          res.postValue.representativePermanentAddress,
        representativeProvince: res.postValue.representativeProvince,
        representativeDistrict: res.postValue.representativeDistrict,
        representativePrecinct: res.postValue.representativePrecinct,
        representativeNationality: res.postValue.representativeNationality,
        idExpiryDate: res.postValue.idExpiryDate
          ? dayjs(res.postValue.idExpiryDate, DateFormat.DATE_ISO)
          : undefined,
        idExpiryDateNote: res.postValue.idExpiryDateNote,
        toggleImpactStatus: res.postValue.toggleImpactStatus,
        originalContractName: res.postValue.originalContractName,
        originalLicenseName: res.postValue.originalLicenseName,
      });
      setChangedFields(getDifferentKeys(res.preValue, res.postValue));
    },
  });
};
