import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  IFieldErrorsItem,
  NotificationSuccess,
  IErrorResponse,
  IPage,
} from '@vissoft-react/common';
import { REACT_QUERY_KEYS } from '../../../../src/constants/query-key';
import {
  IAdvertisement,
  IAdvertisementParams,
  IFormAdvertisement,
  IAdvertisementCreateRequest,
} from '../types';
import { advertisementServices } from '../services';
import { axiosClient } from '../../../../src/services/axios';
import { prefixSaleService } from '../../../../src/constants';

export const useGetAdvertisementList = (params?: IAdvertisementParams) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_ADVERTISEMENT_LIST, params],
    queryFn: async () => {
      const response = await advertisementServices.getAdvertisementList(params);
      // API returns array directly, wrap it into IPage format for LayoutList
      const dataArray = Array.isArray(response) ? response : [];
      const page = params?.page || 0;
      const size = params?.size || 20;
      const result: IPage<IAdvertisement> = {
        content: dataArray,
        totalElements: dataArray.length,
        totalPages: Math.ceil(dataArray.length / size),
        numberOfElements: dataArray.length,
        size,
        number: page,
        pageable: {
          sort: {
            unsorted: true,
            sorted: false,
            empty: true,
          },
          offset: page * size,
          pageSize: size,
          pageNumber: page,
          unpaged: false,
          paged: true,
        },
        sort: {
          unsorted: true,
          sorted: false,
          empty: true,
        },
        last: page >= Math.ceil(dataArray.length / size) - 1,
        first: page === 0,
        empty: dataArray.length === 0,
      };
      return result;
    },
  });
};

export const useGetAdvertisementDetail = (id: string | undefined) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_ADVERTISEMENT_DETAIL, id],
    queryFn: () => {
      if (!id) throw new Error('ID is required');
      return advertisementServices.getAdvertisementDetail(id);
    },
    enabled: !!id,
  });
};

export const useSupportGetAdvertisement = (
  onSuccess: (data: IAdvertisement) => void
) => {
  return useMutation({
    mutationFn: advertisementServices.getAdvertisementDetail,
    onSuccess: (data) => {
      onSuccess(data);
    },
  });
};

export const useSupportCreateAdvertisement = (
  onSuccess: () => void,
  onError: (errorField: IFieldErrorsItem[]) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      data,
      imageFile,
    }: {
      data: IAdvertisementCreateRequest;
      imageFile?: File | null;
    }) => advertisementServices.createAdvertisement(data, imageFile),
    onSuccess: () => {
      NotificationSuccess('Tạo quảng cáo thành công');
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_ADVERTISEMENT_LIST],
      });
      onSuccess();
    },
    onError(error: IErrorResponse & { fieldErrors?: IFieldErrorsItem[] }) {
      if (error?.errors) {
        onError(error?.errors);
      }
    },
  });
};

export const useSupportUpdateAdvertisement = (
  onSuccess: () => void,
  onError: (errorField: IFieldErrorsItem[]) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
      imageFile,
    }: {
      id: string;
      data: IAdvertisementCreateRequest;
      imageFile?: File | null;
    }) => advertisementServices.updateAdvertisement(id, data, imageFile),
    onSuccess: () => {
      NotificationSuccess('Cập nhật quảng cáo thành công');
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_ADVERTISEMENT_LIST],
      });
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_ADVERTISEMENT_DETAIL],
      });
      onSuccess();
    },
    onError(error: IErrorResponse & { fieldErrors?: IFieldErrorsItem[] }) {
      if (error?.errors) {
        onError(error?.errors);
      }
    },
  });
};

export const useSupportDeleteAdvertisement = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: advertisementServices.deleteAdvertisement,
    onSuccess: () => {
      NotificationSuccess('Xóa quảng cáo thành công');
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_ADVERTISEMENT_LIST],
      });
      onSuccess && onSuccess();
    },
  });
};

// Hook để fetch ảnh và tạo blob URL
export const useAdvertisementImageBlobUrl = (fileUrl: string | null | undefined) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.ADVERTISEMENT_IMAGE, fileUrl],
    queryFn: async () => {
      if (!fileUrl) return null;
      
      try {
        const response = await axiosClient.get<Blob>(
          `${prefixSaleService}/files/download`,
          {
            params: { fileUrl },
            responseType: 'blob',
          }
        );
        const blob = response.data instanceof Blob 
          ? response.data 
          : new Blob([response.data], { type: 'image/jpeg' });
        const url = window.URL.createObjectURL(blob);
        return url;
      } catch (error) {
        console.error('Failed to load image:', fileUrl, error);
        return null;
      }
    },
    enabled: !!fileUrl,
    staleTime: 5 * 60 * 1000, // Cache 5 phút
  });
};

