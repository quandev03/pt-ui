import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { agencyListService, getImageDownloadUrl } from '../services';
import {
  IFieldErrorsItem,
  NotificationSuccess,
  IErrorResponse,
  AnyElement,
  NotificationError,
} from '@vissoft-react/common';
import { REACT_QUERY_KEYS } from '../../../../src/constants/query-key';
import { IAgency, IAgencyParams } from '../types';
import { safeApiClient } from '../../../../src/services';
import { prefixSaleService } from '../../../../src/constants';

export const useGetAgencies = (params: IAgencyParams) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_ALL_AGENCY, params],
    queryFn: () => agencyListService.getAgencies(params),
  });
};
export const useSupportGetAgency = (onSuccess: (data: IAgency) => void) => {
  return useMutation({
    mutationFn: agencyListService.getAgency,
    onSuccess: (data) => {
      onSuccess(data);
    },
  });
};
export const useSupportAddAgency = (
  onSuccess: (data: IAgency) => void,
  onError: (errorField: IFieldErrorsItem[]) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: agencyListService.createAgency,
    onSuccess: (data) => {
      NotificationSuccess('Thêm Phòng thành công');
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_ALL_AGENCY],
      });
      onSuccess(data);
    },
    onError(error: IErrorResponse & { fieldErrors?: IFieldErrorsItem[] }) {
      if (error?.errors) {
        onError(error?.errors);
      } else {
        NotificationError({
          message: 'Lỗi hệ thống, thêm mới Phòng thất bại',
        });
      }
    },
  });
};

export function useSupportUpdateUser(
  onSuccess: (data: IAgency) => void,
  onError: (errorField: IFieldErrorsItem[]) => void
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: agencyListService.updateAgency,
    onSuccess: (data) => {
      NotificationSuccess('Cập nhật Phòng thành công');
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_ALL_AGENCY],
      });
      onSuccess(data);
    },
    onError(error: IErrorResponse & { fieldErrors?: IFieldErrorsItem[] }) {
      if (error?.errors) {
        onError(error?.errors);
      }
    },
  });
}

export function useUploadAgencyImages(
  onSuccess?: () => void,
  onError?: (error: IErrorResponse) => void
) {
  return useMutation({
    mutationFn: ({ orgUnitId, files }: { orgUnitId: string; files: File[] }) =>
      agencyListService.uploadAgencyImages(orgUnitId, files),
    onSuccess: () => {
      NotificationSuccess('Upload ảnh thành công');
      onSuccess?.();
    },
    onError: (error: IErrorResponse) => {
      NotificationError({
        message: 'Upload ảnh thất bại',
      });
      onError?.(error);
    },
  });
}

export function useSupportDeleteAgency(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: agencyListService.deleteAgencys,
    onSuccess: () => {
      NotificationSuccess('Xóa thành công');
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_ALL_AGENCY],
      });
      onSuccess && onSuccess();
    },
  });
}

export const convertArrToObj = (arr: AnyElement[], parent: AnyElement) => {
  const newArr = arr
    ?.filter(
      (item) =>
        item.parentId === parent ||
        (!arr?.some((val: AnyElement) => val.id === item.parentId) &&
          parent === null)
    )
    ?.reduce((acc, item) => {
      acc.push({ ...item, children: convertArrToObj(arr, item.id) });
      return acc;
    }, []);

  return newArr?.length > 0 ? newArr : undefined;
};

// Hook để fetch ảnh và tạo blob URL
export const useImageBlobUrls = (fileUrls: string[] | undefined) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.AGENCY_IMAGES, fileUrls],
    queryFn: async () => {
      if (!fileUrls || fileUrls.length === 0) return [];
      
      const blobUrls: string[] = [];
      for (const fileUrl of fileUrls) {
        try {
          const response = await safeApiClient.get<Blob>(
            `${prefixSaleService}/files/download`,
            {
              params: { fileUrl },
              responseType: 'blob',
            }
          );
          const blob = new Blob([response], { type: 'image/jpeg' });
          const url = window.URL.createObjectURL(blob);
          blobUrls.push(url);
        } catch (error) {
          console.error('Failed to load image:', fileUrl, error);
          // Nếu lỗi, thêm empty string để giữ index
          blobUrls.push('');
        }
      }
      return blobUrls;
    },
    enabled: !!fileUrls && fileUrls.length > 0,
    staleTime: 5 * 60 * 1000, // Cache 5 phút
  });
};
