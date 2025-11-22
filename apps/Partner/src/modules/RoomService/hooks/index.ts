import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  IFieldErrorsItem,
  NotificationSuccess,
  IErrorResponse,
  NotificationError,
  IPage,
} from '@vissoft-react/common';
import { REACT_QUERY_KEYS } from '../../../../src/constants/query-key';
import { IRoomService, IRoomServiceForm, IRoomServiceParams } from '../types';
import { roomServiceServices } from '../services';

export const useGetRoomServiceList = (params: IRoomServiceParams) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.ROOM_SERVICE_LIST, params],
    queryFn: async () => {
      const response = await roomServiceServices.getRoomServiceList(params);
      // API returns array directly, wrap it into IPage format
      const dataArray = Array.isArray(response) ? response : [];
      const page = params.page || 0;
      const size = params.size || 20;
      const result: IPage<IRoomService> = {
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

export const useGetRoomServiceDetail = (id: string | undefined) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.ROOM_SERVICE_DETAIL, id],
    queryFn: () => {
      if (!id) throw new Error('ID is required');
      return roomServiceServices.getRoomServiceDetail(id);
    },
    enabled: !!id,
  });
};

export const useCreateRoomService = (
  onSuccess: (data: IRoomService) => void,
  onError: (errorField: IFieldErrorsItem[]) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: roomServiceServices.createRoomService,
    onSuccess: (data) => {
      NotificationSuccess('Thêm dịch vụ phòng thành công');
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.ROOM_SERVICE_LIST],
      });
      onSuccess(data);
    },
    onError(error: IErrorResponse & { fieldErrors?: IFieldErrorsItem[] }) {
      if (error?.errors) {
        onError(error?.errors);
      } else {
        NotificationError({
          message: 'Lỗi hệ thống, thêm mới dịch vụ phòng thất bại',
        });
      }
    },
  });
};

export const useUpdateRoomService = (
  onSuccess: (data: IRoomService) => void,
  onError: (errorField: IFieldErrorsItem[]) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<IRoomServiceForm> }) =>
      roomServiceServices.updateRoomService(id, data),
    onSuccess: (data) => {
      NotificationSuccess('Cập nhật dịch vụ phòng thành công');
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.ROOM_SERVICE_LIST],
      });
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.ROOM_SERVICE_DETAIL],
      });
      onSuccess(data);
    },
    onError(error: IErrorResponse & { fieldErrors?: IFieldErrorsItem[] }) {
      if (error?.errors) {
        onError(error?.errors);
      } else {
        NotificationError({
          message: 'Lỗi hệ thống, cập nhật dịch vụ phòng thất bại',
        });
      }
    },
  });
};

export const useDeleteRoomService = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: roomServiceServices.deleteRoomService,
    onSuccess: () => {
      NotificationSuccess('Xóa dịch vụ phòng thành công');
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.ROOM_SERVICE_LIST],
      });
      onSuccess && onSuccess();
    },
    onError: () => {
      NotificationError({
        message: 'Lỗi hệ thống, xóa dịch vụ phòng thất bại',
      });
    },
  });
};

