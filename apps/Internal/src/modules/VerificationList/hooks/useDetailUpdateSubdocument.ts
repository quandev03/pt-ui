import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { ItemApproveDoc } from '../components/DocumentUpdateHistory/CustomerInfoDoc';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';

export interface Res {
  approvalDate: string
  approvalNote: any
  approvalRejectReasonCode: string
  approvalTime: number
  assignUser: string
  auditStatus: number
  isdn: string
  newData: IDataApproveDoc
  oldData: IDataApproveDoc
  packagePlan: string
  serialSim: string
}

export interface IDataApproveDoc {
  address: string
  birthDate: string
  ccdvvt: string
  contractNo: string
  contractResignTime: string
  customerCode: string
  district: string
  empId: string
  empName: string
  errorsList: any
  id: string
  idIssueDate: string
  idIssueDateNote: any
  idIssuePlace: string
  idNo: string
  idType: string
  imageList: ImageList[]
  name: string
  precinct: string
  province: string
  sex: string
  uploadContractDate: string
  uploadContractType: number
  idExpireDate?: string
}

export interface ImageList {
  createdBy: string
  createdDate: string
  id: number
  imageCode?: string
  imagePath: string
  imageType: string
  version: number
}

interface Req {
  id?: string;
}

const fetcher = (id?: string) => {
  return axiosClient.get<Req, Res>(
    `${prefixCustomerService}/doc-update/detail/${id}`
  );
};

export const useDetailUpdateSubdocument = (id?: string) => {
  return useQuery({
    queryKey: ['detail-update-subdocument', id],
    queryFn: () => fetcher(id),
    select: (data: Res) => data,
    enabled: !!id,
  });
};
