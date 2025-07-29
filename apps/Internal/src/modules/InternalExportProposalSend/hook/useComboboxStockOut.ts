import { ModelStatus } from '@react/commons/types';
import { prefixCatalogService } from '@react/url/app';
import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { IOrganizationUnitDTO } from '../type';

const fetcherDetailStockIn = async (id: string) => {
  const dataDetailStockIn = await axiosClient.get<string, IOrganizationUnitDTO>(
    `${prefixCatalogService}/organization-unit/${id}`
  );
  return dataDetailStockIn;
};

const fetcherFilterStockOutSameLever = async (parentId: string) => {
  const dataFilterStockOutSameLever = await axiosClient.get<
    IOrganizationUnitDTO[],
    any
  >(`${prefixCatalogService}/organization-unit`);
  const stockFather = await axiosClient.get<IOrganizationUnitDTO, any>(
    `${prefixCatalogService}/organization-unit/${parentId}`
  );
  const result = dataFilterStockOutSameLever.filter(
    (item: IOrganizationUnitDTO) =>
      item.parentId === Number(parentId) && item.status === ModelStatus.ACTIVE
  );
  return [...result, stockFather];
};

const fetcher = async (id: string) => {
  const parentIdData = await fetcherDetailStockIn(id);
  if (parentIdData.parentId) {
    const res = (
      await fetcherFilterStockOutSameLever(String(parentIdData.parentId))
    ).filter((item) => {
      return item.id !== id;
    });
    const result = res.map((item) => {
      return {
        label: item.orgName,
        value: item.id,
      };
    });
    return result;
  }
  return [];
};

export const useComboboxStockOut = (onSuccess?: (data: any) => void) => {
  return useMutation({
    mutationFn: fetcher,
    onSuccess: (data) => {
      onSuccess && onSuccess(data);
    },
  });
};
