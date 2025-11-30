import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  IFieldErrorsItem,
  NotificationSuccess,
  IErrorResponse,
  NotificationError,
  IPage,
} from '@vissoft-react/common';
import { REACT_QUERY_KEYS } from '../../../../src/constants/query-key';
import {
  IContract,
  IContractParams,
  IOCRParams,
  IOCRResponse,
  IGenContractParams,
  ISaveContractParams,
} from '../types';
import { contractManagementServices } from '../services';

export const useGetContractList = (params: IContractParams) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.CONTRACT_LIST, params],
    queryFn: async () => {
      // API returns IPage<IContract> directly
      const response = await contractManagementServices.getContractList(params);
      return response;
    },
  });
};

export const useGetContractDetail = (id: string | undefined) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.CONTRACT_DETAIL, id],
    queryFn: () => {
      if (!id) throw new Error('ID is required');
      return contractManagementServices.getContractDetail(id);
    },
    enabled: !!id,
  });
};

export const useOCRData = (
  onSuccess: (data: IOCRResponse) => void,
  onError?: (error: string) => void
) => {
  return useMutation({
    mutationFn: (params: IOCRParams) => contractManagementServices.ocrData(params),
    onSuccess: (data) => {
      // Handle case where response might be wrapped
      const ocrResponse: IOCRResponse = (data as any)?.data || data;
      
      // Validate response structure
      if (!ocrResponse?.data_ocr?.ocr_front) {
        const errorMessage = 'Dữ liệu OCR không đúng định dạng';
        NotificationError({
          message: errorMessage,
        });
        onError && onError(errorMessage);
        return;
      }
      
      NotificationSuccess('Lấy thông tin OCR thành công');
      onSuccess(ocrResponse);
    },
    onError: (error: IErrorResponse) => {
      const errorMessage =
        error?.message || 'Lỗi hệ thống, không thể lấy thông tin OCR';
      NotificationError({
        message: errorMessage,
      });
      onError && onError(errorMessage);
    },
  });
};

export const useGenContract = (
  onSuccess: (data: Blob) => void,
  onError?: (error: string) => void
) => {
  return useMutation({
    mutationFn: (params: IGenContractParams) =>
      contractManagementServices.genContract(params),
    onSuccess: (data) => {
      onSuccess(data);
    },
    onError: (error: IErrorResponse) => {
      const errorMessage =
        error?.message || 'Lỗi hệ thống, không thể tạo hợp đồng';
      NotificationError({
        message: errorMessage,
      });
      onError && onError(errorMessage);
    },
  });
};

export const useSaveContract = (
  onSuccess: (data: IContract) => void,
  onError: (errorField: IFieldErrorsItem[]) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: ISaveContractParams) =>
      contractManagementServices.saveContract(params),
    onSuccess: (data) => {
      NotificationSuccess('Lưu hợp đồng thành công');
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.CONTRACT_LIST],
      });
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.CONTRACT_DETAIL],
      });
      onSuccess(data);
    },
    onError(error: IErrorResponse & { fieldErrors?: IFieldErrorsItem[] }) {
      if (error?.errors) {
        onError(error?.errors);
      } else {
        NotificationError({
          message: 'Lỗi hệ thống, lưu hợp đồng thất bại',
        });
      }
    },
  });
};

