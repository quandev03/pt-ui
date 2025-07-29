import { IPage } from '@react/commons/types';
import { axiosClient } from 'apps/Internal/src/service';
import { IRequest } from '../../LookupNumber/type';
import { IApprovalStep, IPhoneNumberSelect, IProcessApproved } from '../type';
import { API_PATHS } from './url';
import { INumberTransactionDetail } from 'apps/Internal/src/app/types';
import { NumberProcessType } from 'apps/Internal/src/constants/constants';

export const getDetailDistributeNumber = (id?: number | string) => {
  return axiosClient.get<string, INumberTransactionDetail>(
    API_PATHS.DETAIL_DISTRIBUTE_NUMBER(id)
  );
};

export const addDistributeNumber = (values: Record<string, any | any[]>) => {
  const {
    stockId,
    ieStockId,
    description,
    processType,
    reasonId,
    files,
    numberFile,
    listPhoneNumber,
  } = values;

  const formData = new FormData();
  if (NumberProcessType.BATCH === processType && numberFile) {
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
  const numbers = listPhoneNumber.map((item: any) => {
    return `${item.isdn}`;
  });
  const metadata = {
    stockId: stockId,
    ieStockId: ieStockId,
    processType: processType,
    reasonId: reasonId,
    ...(description && { description }),
    ...(numbers && { numbers }),
  };

  formData.append(
    'metadata',
    new Blob([JSON.stringify(metadata)], { type: 'application/json' })
  );
  return axiosClient.post(API_PATHS.POST_DISTRIBUTE_NUMBER, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    responseType: 'blob',
  });
};

export const getActionSample = ({ uri, params }: IRequest) => {
  return axiosClient.get<IRequest, Blob>(uri, {
    params,
    responseType: 'blob',
  });
};

export const getOrganizationCurrent = () => {
  return axiosClient.get(API_PATHS.GET_ORGANIZATION_CURRENT);
};

export const postCancelDistributeNumber = (id: number) => {
  return axiosClient.post(API_PATHS.CANCEL_DISTRIBUTE_NUMBER(id));
};

export const getListStockIsdnOrg = (id: number | string) => {
  return axiosClient.get<string, IPhoneNumberSelect[]>(
    API_PATHS.GET_STOCK_ISDN_ORG(id)
  );
};

export const postApprovalProcessStep = (body: IApprovalStep) => {
  return axiosClient.post<string, IProcessApproved[]>(
    API_PATHS.APPROVAL_PROCESSS_STEP,
    body
  );
};

export const getUrlDownloadFile = (path: string) => {
  return axiosClient.get<string, Blob>(`${API_PATHS.DOWNLOAD_FILE}/${path}`, {
    responseType: 'blob',
  });
};
