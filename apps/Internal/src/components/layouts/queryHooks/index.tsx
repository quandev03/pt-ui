import { CriteriaType } from '@react/commons/types';
import { FILE_TYPE } from '@react/constants/app';
import { downloadFilePdf } from '@react/utils/handleFile';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { Tooltip } from 'antd';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { LayoutService } from '../services';
import { AllUserType, ICriteriaItem, INotificationParams } from '../types';

export function useSupportGetMenu(isCall: boolean) {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_MENU],
    enabled: isCall,
    retry: false,
    queryFn: () => {
      return LayoutService.getMenu();
    },
  });
}

export const useGetAllUsers = (params: AllUserType) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_ALL_USERS, params],
    queryFn: () => {
      return LayoutService.getAllUsers(params);
    },
  });
};

export const useGetAllRole = (params: { isPartner: boolean }) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_ALL_ROLES, params],
    queryFn: () => {
      return LayoutService.getAllRoles(params);
    },
  });
};

export const useGetCriteria = () => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_CRITERIA],
    queryFn: LayoutService.getCriteria,
    select: (data) => {
      const result: {
        label: string;
        value: string;
        name: string;
      }[] = [];
      data.forEach((item: ICriteriaItem) => {
        result.push({
          label: CriteriaType[item.code as keyof typeof CriteriaType],
          value: item.code,
          name: item.name,
        });
      });
      const res = result.sort((a, b) => (a.label > b.label ? 1 : -1));
      return res.map((item) => ({
        ...item,
        label: (
          <Tooltip title={item.label + ': ' + item.name} placement="right">
            {item.label}
          </Tooltip>
        ),
      }));
    },
  });
};

export const useGetCurrentUsers = () => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_ALL_GROUP_USER],
    queryFn: () => {
      return LayoutService.getCurrentUser();
    },
  });
};
export const useGetImage = (
  url: string,
  isProfilePicture?: boolean,
  isBlob?: boolean
) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_IMAGE, url, isProfilePicture, isBlob],
    queryFn: () => LayoutService.getImage(url, isProfilePicture, isBlob),
    select: (data) => data,
    enabled: !!url,
  });
};
export const useGetPdf = (url: string) => {
  return useQuery({
    queryKey: ['get-pdf-contract', url],
    queryFn: () => LayoutService.getPdf(url),
    enabled: !!url,
  });
};
export const useGetPdfBlob = (url: string) => {
  return useQuery({
    queryKey: ['get-pdf-blob', url],
    queryFn: () => LayoutService.getPdfBlob(url),
    enabled: !!url,
  });
};
export const useDownloadFilePdfMutation = () => {
  return useMutation({
    mutationFn: LayoutService.downloadPdf,
    onSuccess: (data, variables) => downloadFilePdf(data, variables.filename),
  });
};
export const useGetParamsOption = (isCall: boolean) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_PARAMS],
    queryFn: LayoutService.getParamsOption,
    enabled: isCall,
  });
};

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
export const useGetImageCatalog = (url: string) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_IMAGE, url],
    queryFn: () => LayoutService.getImageCatalog(url),
    select: (data) => data,
    enabled: !!url,
  });
};

export const useInfinityScrollNotification = (params: INotificationParams) => {
  return useInfiniteQuery({
    queryKey: ['useInfinityScrollNotificationKey', params],
    initialPageParam: 0,
    queryFn: ({ pageParam = 0 }) => {
      return LayoutService.getNotification({ ...params, page: pageParam });
    },
    select: (data) => {
      const { pages } = data;
      const result = pages.flatMap((page) => page.content);
      return {
        data: result,
        total: pages[0].totalUnseen ?? 0,
      };
    },
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.last || !lastPage.content || lastPage.content.length === 0) {
        return undefined;
      }
      if (lastPage.content.length > 0 && lastPage.number !== 0) {
        params.lastNotificationId =
          lastPage.content[lastPage.content.length - 1].id;
      }
      return lastPage.number + 1;
    },
    refetchOnWindowFocus: true,
  });
};

export const useReadOneNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: LayoutService.readOneNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['useInfinityScrollNotificationKey'],
      });
    },
    onError: (error) => {
      console.log('🚀 ~ useReadOneNotification ~ onError:', error);
    },
  });
};

export const useReadAllNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: LayoutService.readAllNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['useInfinityScrollNotificationKey'],
      });
    },
  });
};

export const useGetProfile = (isAuthenticated: boolean) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_PROFILE],
    queryFn: () => {
      return LayoutService.getProfile();
    },
    retry: 1,
    enabled: isAuthenticated,
  });
};
