import { useMutation } from '@tanstack/react-query';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';
import { axiosClient } from 'apps/Internal/src/service';

export interface ParamSubInfo {
  changeSimCode: string;
  isdn: string;
}

export interface FileInfoItem {
  fileCode: string;
  filePath: string;
  fileType: string;
}

export interface SubInfoResponse {
  changeSimNo: string;
  customerCode: string;
  oldSerialSim: string;
  fileInfos: FileInfoItem[];
}

const fetcher = (body: ParamSubInfo) => {
  return axiosClient.get<ParamSubInfo, SubInfoResponse>(
    `${prefixCustomerService}/change-sim/sub-info/${body.isdn?.substring(1)}/${
      body.changeSimCode
    }`
  );
};

export const useCheckIsdnInfo = (
  onSuccess: (data: SubInfoResponse) => void
) => {
  return useMutation({
    mutationFn: fetcher,
    onSuccess: (res) => {
      onSuccess(res);
    },
  });
};
