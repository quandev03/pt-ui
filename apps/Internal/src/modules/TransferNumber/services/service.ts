import { IPage } from '@react/commons/types';
import { axiosClient } from 'apps/Internal/src/service';
import { IParams, IStockNumber } from '../type';
import { API_PATHS } from './url';
import { INumberTransactionDetail } from 'apps/Internal/src/app/types';

export const fetcher = (params: IParams) => {
  return axiosClient.get<string, IPage<INumberTransactionDetail>>(
    API_PATHS.GET_STOCK_TRANSFER_NUMBER,
    { params }
  );
};

export const getTransferNumberDetail = (id: number) => {
  return axiosClient.get<string, INumberTransactionDetail>(
    API_PATHS.GET_TRANSFER_NUMBER_DETAIL(id)
  );
};

export const getFileUpload = ({ url }: { url: string; filename: string }) => {
  return axiosClient.get<string, Blob>(url, {
    responseType: 'blob',
  });
};

export const addTransferNumber = (values: Record<string, any | any[]>) => {
  const formData = new FormData();
  const {
    processType,
    stockId,
    description,
    reasonId,
    moveType,
    files,
    ieStockId,
    numberFile,
    listNumbers,
  } = values;

  const numbers =
    listNumbers &&
    listNumbers.map((item: any) => {
      return `0${item.isdn}`;
    });

  if (numberFile) {
    formData.set('numberFile', numberFile);
  }

  if (files) {
    const attachmentInfos: { description: string }[] = [];
    files.forEach((fileData: { files: File; desc: string }) => {
      formData.append('attachmentFiles', fileData.files);
      attachmentInfos.push({ description: fileData.desc });
    });
    formData.set(
      'attachmentInfos',
      new Blob([JSON.stringify(attachmentInfos)], {
        type: 'application/json',
      })
    );
  }
  const metadata = {
    processType,
    ieStockId,
    stockId,
    reasonId,
    moveType,
    description,
    ...(numbers && { numbers }),
  };
  formData.set(
    'metadata',
    new Blob([JSON.stringify(metadata)], { type: 'application/json' })
  );
  return axiosClient.post<string, Blob>(
    `${API_PATHS.ADD_TRANSFER_NUMBER}`,
    formData,
    {
      responseType: 'blob',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
};

export const cancelTransferNumber = (id: number | string) => {
  return axiosClient.delete(API_PATHS.CANCEL_TRANSFER_NUMBER(id));
};

export const getStockNumber = (id?: number) => {
  return axiosClient.get<string, IStockNumber[]>(API_PATHS.GET_STOCK_NUMBER, {
    params: id ? { 'stock-isdn-org': id, requireAccess: true } : undefined,
  });
};

export const getApprovalProcess = (data: any) => {
  return axiosClient.post<string, any>(API_PATHS.GET_APPROVAL_PROCESS, data);
};
