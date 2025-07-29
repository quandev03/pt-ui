import { IPage, IParamsRequest } from '@react/commons/types';
import { prefixResourceService } from '@react/url/app';
import { useQuery } from '@tanstack/react-query';
import { axiosClient } from '../service';

const getDistributeNumber = (params: IParams) => {
  return axiosClient.get<string, IPage<INumberTransactionDetail>>(
    `${prefixResourceService}/distribute-number`,
    { params }
  );
};
export const useGetDistributeNumber = (params: any) => {
  return useQuery({
    queryKey: ['useGetDistributeNumberKey', params],
    queryFn: () => getDistributeNumber(params),
    enabled: !!params,
  });
};

export interface IParams extends IParamsRequest {
  moveType?: number; // "loại điều chuyển: Nội bộ: 1/Khác: 2/ tất cả: không truyền"
  stockId?: number; // kho xuất
  ieStockId?: number; // kho nhập
  processType?: number; //  Kiểu điều chuyển: đơn lẻ: 1/theo lô: 2/ tất cả: không truyền
  from?: string; // ngày từ
  to?: string; // ngày đến
}

export interface INumberTransactionDetail {
  id: number;
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  transDate: string;
  stockId: number;
  stockName: string;
  ieStockId: number;
  ieStockName: string;
  transStatus: number;
  transStatusName: string;
  transType: number;
  transTypeName: string;
  approvalStatus: number;
  approvalStatusName: string;
  reasonId: number;
  processType: number;
  processTypeName: string;
  totalNumber: number;
  failedNumber: number;
  succeededNumber: number;
  description: string;
  uploadStatus: number;
  uploadStatusName: string;
  validSucceededNumber: number;
  validFailedNumber: number;
  moveType: number;
  moveTypeName: string;
  lines?: INumberTransactionLine[];
  uploadFile?: IFileInfo;
  resultCheckFile?: IFileInfo;
  resultFile?: IFileInfo;
  attachments?: IAttachmentInfo[];
  uploadFilename: string;
  productId?: number;
  isdn?: string;
}
export interface IFileInfo {
  fileName: string;
  fileUrl: string;
}
export interface INumberTransactionLine {
  id: number;
  transDate: string;
  isdnTransId: number;
  fromIsdn: number;
  toIsdn?: number;
  quantity: number;
  status: number;
  error: string;
  description: string;
  groupCode: string;
  groupName: string;
  isdnPattern: string;
  generalFormat: string;
  result: string;
}
export interface IAttachmentInfo {
  id: string | number;
  recordId: string | number;
  objectName: string;
  fileName: string;
  fileUrl: string;
  fileVolume: string | number;
  description: string;
  createdDate: any;
  createdBy: string;
  name: string;
  fileNumber: number;
  desc: string;
  size: string;
}
