import { useQuery } from '@tanstack/react-query';
import { getChooseProduct, getChooseProductImport } from '../services';
import { ParamsSearch } from 'apps/Internal/src/modules/ImportExportTransactionOtherWay/type';

export const useGetChooseProductKey = 'useGetChooseProductKey';
export const useGetChooseProductImportKey = 'useGetChooseProductImportKey';
export const useGetChooseProduct = (params: ParamsSearch, isCall: boolean) => {
  return useQuery({
    queryFn: () => getChooseProduct(params),
    queryKey: [useGetChooseProductKey, params],
    enabled: isCall,
  });
};

export const useGetChooseProductImport = (
  params: ParamsSearch,
  isCall: boolean
) => {
  return useQuery({
    queryFn: () => getChooseProductImport(params),
    queryKey: [useGetChooseProductImportKey, params],
    enabled: isCall,
  });
};
