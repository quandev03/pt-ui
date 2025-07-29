import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import { downloadFile } from '@react/utils/handleFile';
import { useMutation, useQuery } from '@tanstack/react-query';
import { IUserInfo } from 'apps/Internal/src/components/layouts/types';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { feedbackService } from '../services';
import {
  FeedbackDestinationEnum,
  IChangeStatusFeedback,
  IFeedbackParam,
  IListChannelFeedback,
  NoteFeedbackRequest,
  StatusEnum,
} from '../types';
import { ModelStatus } from '@react/commons/types';

export const useFetchFeedbackTypes = () => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_FEEDBACK_TYPE],
    queryFn: () => feedbackService.getListFeedbackType(),
  });
};

export const useListFeedbackCSKH = (params: IFeedbackParam) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.SEARCH_FEEDBACK_CSKH, params],
    queryFn: () => feedbackService.searchFeedbackCSKHApi(params),
  });
};

export const useListFeedbackBO = (params: IFeedbackParam) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.SEARCH_FEEDBACK_BO, params],
    queryFn: () => feedbackService.searchFeedbackBOApi(params),
  });
};

export const useListFeedbackAssign = (params: IFeedbackParam) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.SEARCH_FEEDBACK_ASSIGN, params],
    queryFn: () => feedbackService.searchFeedbackAssignApi(params),
  });
};

export const useExportMutationCSKH = () => {
  return useMutation({
    mutationFn: feedbackService.exportCSKH,
    onSuccess: (data, { fileName }) => downloadFile(data, fileName),
  });
};

export const useExportMutationBO = () => {
  return useMutation({
    mutationFn: feedbackService.exportBO,
    onSuccess: (data, { fileName }) => downloadFile(data, fileName),
  });
};

export const useActiveUsers = (params: {
  status: number;
  departmentCode?: string;
}) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_ALL_USERS, params],
    queryFn: () => feedbackService.getUsersActive(params),
  });
};

export const useActiveUserByDepartment = (onSuccess: (data: any) => void) => {
  return useMutation({
    onSuccess: onSuccess,
    mutationFn: (params: { departmentCode?: string }) =>
      feedbackService.getUsersActive(params),
  });
};

export const useCreateFeedback = (
  onSuccess: (data: any) => void,
  onError: (data: any) => void
) => {
  return useMutation({
    mutationFn: feedbackService.createFeedbackCSKH,
    onSuccess: onSuccess,
    onError: onError,
  });
};

export const useEditFeedback = (onSuccess: (data: any) => void) => {
  return useMutation({
    mutationFn: ({ data, id }: { data: FormData; id: string }) =>
      feedbackService.editFeedbackCSKH({ data, id }),
    onSuccess: onSuccess,
  });
};

export const useDetailFeedback = (onSuccess: (data: any) => void) => {
  return useMutation({
    onSuccess: onSuccess,
    mutationFn: (id: string | number) => feedbackService.getDetailFeedback(id),
  });
};

export const useSendComment = (onSuccess: (data: any) => void) => {
  return useMutation({
    onSuccess: onSuccess,
    mutationFn: (data: NoteFeedbackRequest) =>
      feedbackService.sendComment(data),
  });
};

export const useRejectFeedback = (
  onSuccess: (data: any, variables: any) => void
) => {
  return useMutation({
    onSuccess: onSuccess,
    mutationFn: (data: IChangeStatusFeedback) =>
      feedbackService.rejectFeedback(data),
  });
};

export const useOpenFeedback = (onSuccess: () => void) => {
  return useMutation({
    onSuccess: onSuccess,
    mutationFn: (data: IChangeStatusFeedback) =>
      feedbackService.openFeedback(data),
  });
};

export const useProgressFeedback = (
  onSuccess: (data: any, variables: any) => void
) => {
  return useMutation({
    onSuccess: onSuccess,
    mutationFn: (data: any) => feedbackService.progressFeedback(data),
  });
};

export const useCloseFeedback = (onSuccess: (data: any) => void) => {
  return useMutation({
    onSuccess: onSuccess,
    mutationFn: (data: IChangeStatusFeedback) =>
      feedbackService.closeFeedback(data),
  });
};

export const useCancelFeedback = (onSuccess: () => void) => {
  return useMutation({
    onSuccess: onSuccess,
    mutationFn: (data: IChangeStatusFeedback) =>
      feedbackService.cancelFeedback(data),
  });
};

export const useApproveFeedback = (onSuccess: () => void) => {
  return useMutation({
    onSuccess: onSuccess,
    mutationFn: (data: IChangeStatusFeedback) =>
      feedbackService.approveFeedback(data),
  });
};

export const useAcceptFeedback = (onSuccess: (data: any) => void) => {
  return useMutation({
    onSuccess: onSuccess,
    mutationFn: (data: IChangeStatusFeedback) =>
      feedbackService.acceptFeedback(data),
  });
};

export const useSendEmailFeedback = (onSuccess: () => void) => {
  return useMutation({
    onSuccess: onSuccess,
    mutationFn: (data: { id: number; type: FeedbackDestinationEnum }) =>
      feedbackService.sendEmail(data),
  });
};

export const useUserDepartmentCode = () => {
  const currentUser = useGetDataFromQueryKey<IUserInfo>([
    REACT_QUERY_KEYS.GET_PROFILE,
  ]);
  return currentUser?.departments?.[0]?.code || null;
};

export const useUserName = () => {
  const currentUser = useGetDataFromQueryKey<IUserInfo>([
    REACT_QUERY_KEYS.GET_PROFILE,
  ]);
  return currentUser?.username || null;
};

export const useFullname = () => {
  const currentUser = useGetDataFromQueryKey<IUserInfo>([
    REACT_QUERY_KEYS.GET_PROFILE,
  ]);
  return currentUser?.fullname || null;
};

export const useEmail = () => {
  const currentUser = useGetDataFromQueryKey<IUserInfo>([
    REACT_QUERY_KEYS.GET_PROFILE,
  ]);
  return currentUser?.email || null;
};

export const useListPriorityById = (onSuccess: (data: any[]) => void) => {
  return useMutation({
    onSuccess: onSuccess,
    mutationFn: (params: { feedbackTypeId?: number }) =>
      feedbackService.getPrioritById(params as any),
  });
};

export const useListPriority = () => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.SEARCH_PRIORITY],
    queryFn: () => feedbackService.getAllPriority(),
  });
};

export const useCheckCountFeedback = (onSuccess: (data: any) => void) => {
  return useMutation({
    onSuccess: onSuccess,
    mutationFn: (params: { feedbackTypeId: number; isdn: number }) =>
      feedbackService.checkFeedbackCount(params),
  });
};

export const useDetailFeedbackType = (onSuccess: (data: any) => void) => {
  return useMutation({
    onSuccess: onSuccess,
    mutationFn: (params: { id: number }) =>
      feedbackService.getFeedbackTypeDetail(params),
  });
};

export const useCheckActiveIsdn = (params: { isdn?: string[] }) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.CHECK_ISDN_STATUS, params],
    queryFn: () => feedbackService.checkIsdnStatus(params),
    enabled: !!params.isdn && params.isdn.length > 0,
  });
};
export const useListChannelFeedback = () => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_LIST_CHANNEL_FEEDBACK],
    queryFn: () => feedbackService.getListChannelFeedback(),
    select: (data) => {
      return data.filter((item: IListChannelFeedback) => item.status === ModelStatus.ACTIVE).map((item: IListChannelFeedback) => ({
        label: item.name,
        value: item.code,
      }));
    },
  });
};