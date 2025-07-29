import { useMutation, useQuery } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from 'apps/Partner/src/constants/querykeys';
import { LayoutService } from '../services';
import { FILE_TYPE } from '@react/constants/app';

export function useSupportGetMenu(isCall: boolean) {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_MENU],
    retry: false,
    enabled: isCall,
    queryFn: LayoutService.getMenu,
  });
}

export function useSupportPartnerInfo(params?: { vnskyInfo: boolean }) {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_PARTNER_INFO, params],
    queryFn: () => {
      return LayoutService.getPartnerInfor(params);
    },
  });
}
export const useGetFileDownloadSaleService = () => {
  return useMutation({
    mutationFn: LayoutService.getFileDownloadSaleService,
    onSuccess(data, payload) {
      const { fileName } = payload;
      const filenameSplit = fileName.split('.');
      const fileType = filenameSplit[
        filenameSplit.length - 1
      ] as keyof typeof FILE_TYPE;

      const blob = new Blob([data], {
        type: FILE_TYPE[fileType],
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(a.href);
      a.remove();
    },
  });
};
export const useGetParamsOption = (isCall: boolean) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_PARAMS_OPTION],
    queryFn: LayoutService.getParamsOption,
    enabled: isCall,
    retry: false,
  });
};

export const useGetAllRole = () => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_ALL_ROLES],
    queryFn: () => {
      return LayoutService.getAllRoles();
    },
  });
};

export function useGetProfile(isAuthenticated: boolean) {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_PROFILE],
    queryFn: () => {
      return LayoutService.getProfile();
    },
    enabled: isAuthenticated,
    retry: false,
  });
}