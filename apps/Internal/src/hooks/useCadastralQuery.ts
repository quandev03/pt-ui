import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { axiosClient } from '../service';
import { prefixCatalogService } from '../constants/app';

export interface CadastralRequest {
  type: string;
  parentId?: string;
}

export type Cadastral = {
  id: string;
  areaCode: string;
  areaName: string;
  areaType: string;
  mbfAreaCode: string;
  providerAreaCode: string;
};

export enum CadastralType {
  PROVINCE = 'PROVINCE',
  DISTRICT = 'DISTRICT',
  VILLAGE = 'VILLAGE',
}

const fetcher = (params: CadastralRequest) => {
  return axiosClient.get<CadastralRequest, Cadastral[]>(
    `${prefixCatalogService}/area`,
    { params: { parentId: params.parentId } }
  );
};

export const useCadastralQuery = (params: CadastralRequest) => {
  const [provinces, setProvinces] = useState<Cadastral[]>([]);
  const [districts, setDistricts] = useState<Cadastral[]>([]);
  const [villages, setVillages] = useState<Cadastral[]>([]);

  const { data } = useQuery({
    queryKey: ['GET_LIST_CADASTRAL', params],
    queryFn: () => fetcher(params),
    enabled: !!params.parentId || params.type === CadastralType.PROVINCE,
  });

  useEffect(() => {
    if (!params.parentId && params.type === CadastralType.DISTRICT) {
      setDistricts([]);
      setVillages([]);
    }
    if (!params.parentId && params.type === CadastralType.VILLAGE) {
      setVillages([]);
    }
  }, [params.parentId]);

  useEffect(() => {
    if (data?.length) {
      switch (params.type) {
        case CadastralType.PROVINCE:
          setProvinces(data);
          break;
        case CadastralType.DISTRICT:
          setDistricts(data);
          break;
        case CadastralType.VILLAGE:
          setVillages(data);
          break;
      }
    }
  }, [data]);

  return { provinces, districts, villages };
};
