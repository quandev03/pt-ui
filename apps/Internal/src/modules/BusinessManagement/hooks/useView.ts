import { axiosClient } from 'apps/Internal/src/service';
import { useMutation } from '@tanstack/react-query';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';
import useStoreBusinessManagement from '../store';
import { DateFormat } from '@react/constants/app';
import dayjs from 'dayjs';

const fetcher = async (id: string) => {
  return await axiosClient.get<any, any>(
    `${prefixCustomerService}/enterprise/detail-enterprise/${id}`
  );
};

export const useView = () => {
  const { formAntd: form } = useStoreBusinessManagement();

  return useMutation({
    mutationFn: fetcher,
    onSuccess: (res) => {
      form.setFieldsValue({
        taxCode: res.taxCode,
        enterpriseName: res.enterpriseName,
        phone: res.enterprisePhone,
        enterpriseEmail: res.enterpriseEmail,
        address: res.enterpriseAddress,
        enterpriseProvince: res.enterpriseProvince,
        enterpriseDistrict: res.enterpriseDistrict,
        enterprisePrecinct: res.enterprisePrecinct,
        establishmentDate: res.establishmentDate
          ? dayjs(res.establishmentDate, DateFormat.DATE_ISO)
          : undefined,
        contractDate: res.contractDate
          ? dayjs(res.contractDate, DateFormat.DATE_ISO)
          : undefined,
        contractNumber: res.contractNumber,
        contractFilePath: res.contractFilePath,
        licenseFilePath: res.licenseFilePath,
        note: res.note,
        supervisorId: res.supervisorId,
        amEmployeeIdList: res.amEmployeeIdList,
        status: res.status === 1 ? true : false,
        cardFrontView: res.representativeFrontImgPath,
        cardBackView: res.representativeBackImgPath,
        portraitView: res.representativePortraitImgPath,
        representativeIdType: res.representativeIdType,
        representativeIdNumber: res.representativeIdNumber,
        representativeIdIssueDate: res.representativeIdIssueDate
          ? dayjs(res.representativeIdIssueDate, DateFormat.DATE_ISO)
          : undefined,
        representativeGender: res.representativeGender,
        representativeName: res.representativeName,
        representativeIdIssuePlace: res.representativeIdIssuePlace,
        representativeBirthDate: res.representativeBirthDate
          ? dayjs(res.representativeBirthDate, DateFormat.DATE_ISO)
          : undefined,
        representativePermanentAddress: res.representativePermanentAddress,
        representativeProvince: res.representativeProvince,
        representativeDistrict: res.representativeDistrict,
        representativePrecinct: res.representativePrecinct,
        representativeNationality: res.representativeNationality,
        idExpiryDate: res.idExpiryDate
          ? dayjs(res.idExpiryDate, DateFormat.DATE_ISO)
          : undefined,
        idExpiryDateNote: res.idExpiryDateNote,
        toggleImpactStatus: res.toggleImpactStatus,
        originalContractName: res.originalContractName,
        originalLicenseName: res.originalLicenseName,
      });
    },
  });
};
