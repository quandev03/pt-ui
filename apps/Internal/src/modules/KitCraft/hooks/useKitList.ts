import { IPage, IParamsRequest } from '@react/commons/types';
import { prefixResourceService } from '@react/url/app';
import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';

export interface IParamsListKit extends IParamsRequest {
  isdn?: string;
  productId?: number;
  fromSerial?: string;
  toSerial?: string;
  packageId?: string;
}

export interface IKitListItem {
  id: number;
  isdn: number;
  serial: number;
  productName: string;
  packageProfileName: string;
  isdnType: string;
  profileType: string;
  simType: string;
  stockIsdnName: string;
  stockSerialName: string;
  processType: number;
  ownerName: any;
  createdBy: string;
  createdDate: string;
  status: number | string;
}

export const queryKeyListKitCraft = 'query-list-kit-craft';

const fetcher = (params: IParamsListKit) => {
  return axiosClient.get<Request, IPage<IKitListItem>>(
    `${prefixResourceService}/sim-registrations/kit-list`,
    { params: { ...params, productName: undefined, packageName: undefined } }
  );
};

export const useKitList = (params: IParamsListKit) => {
  return useQuery({
    queryFn: () => fetcher(params),
    queryKey: [queryKeyListKitCraft, params],
    enabled: true,
  });
};
