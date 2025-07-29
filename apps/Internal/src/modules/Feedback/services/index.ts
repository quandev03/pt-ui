import { axiosClient } from 'apps/Internal/src/service';
import {
  prefixAuthServicePrivate,
  prefixCustomerService,
} from '@react/url/app';
import {
  FeedbackDestinationEnum,
  IChangeStatusFeedback,
  IFeedback,
  IFeedbackParam,
  IFeedbackRequest,
  IFeedbackType,
  IListChannelFeedback,
  NoteFeedbackRequest,
} from '../types';
import { IPage } from '@react/commons/types';

export const feedbackService = {
  getListFeedbackType: async () => {
    const res: IFeedbackType[] = await axiosClient.get(
      `${prefixCustomerService}/feedback-type`
    );
    return res || [];
  },

  searchFeedbackCSKHApi: async (params: IFeedbackParam) => {
    const res: IPage<IFeedback[]> = await axiosClient.get(
      `${prefixCustomerService}/feedback-request/get-feedback-request-list`,
      { params }
    );
    return res || [];
  },

  searchFeedbackBOApi: async (params: IFeedbackParam) => {
    const res: IPage<IFeedback[]> = await axiosClient.get(
      `${prefixCustomerService}/feedback/get-feedback-request-list-BO`,
      { params }
    );
    return res || [];
  },

  searchFeedbackAssignApi: async (params: IFeedbackParam) => {
    const res: IPage<IFeedback[]> = await axiosClient.get(
      `${prefixCustomerService}/feedback/get-feedback-request-list-assign`,
      { params }
    );
    return res || [];
  },

  exportCSKH: ({ params }: { params: IFeedbackParam; fileName: string }) => {
    return axiosClient.get<IFeedbackParam, Blob>(
      `${prefixCustomerService}/feedback-request/get-feedback-request-excel`,
      {
        params,
        responseType: 'blob',
      }
    );
  },

  exportBO: ({ params }: { params: IFeedbackParam; fileName: string }) => {
    return axiosClient.get<IFeedbackParam, Blob>(
      `${prefixCustomerService}/feedback/get-feedback-request-excelBO`,
      {
        params,
        responseType: 'blob',
      }
    );
  },

  getUsersActive: async (params: {
    status?: number;
    departmentCode?: string;
  }) => {
    const res = await axiosClient.get<any, any[]>(
      `${prefixAuthServicePrivate}/api/users/internal/all`,
      { params }
    );
    if (!res) throw new Error('Oops');
    return res;
  },

  createFeedbackCSKH: (data: FormData) => {
    return axiosClient.post<any>(
      `${prefixCustomerService}/feedback-request/create-feedback-request`,
      data
    );
  },

  editFeedbackCSKH: ({ data, id }: { data: FormData; id: string }) => {
    return axiosClient.put<any>(
      `${prefixCustomerService}/feedback-request/update-feedback-request/${id}`,
      data
    );
  },

  getDetailFeedback: async (id: string | number) => {
    const res: IPage<IFeedback[]> = await axiosClient.get(
      `${prefixCustomerService}/feedback-request/detail-feedback-request/${id}`
    );
    return res;
  },

  sendComment: (data: NoteFeedbackRequest) => {
    return axiosClient.post<any>(
      `${prefixCustomerService}/feedback-request/send-note`,
      data
    );
  },

  sendEmail: (data: { id: number; type: FeedbackDestinationEnum }) => {
    return axiosClient.post<any>(
      `${prefixCustomerService}/feedback-request/send-overdue-warning`,
      data
    );
  },

  rejectFeedback: (data: IChangeStatusFeedback) => {
    return axiosClient.post<any>(
      `${prefixCustomerService}/feedback/reject-feedback`,
      data
    );
  },

  openFeedback: (data: IChangeStatusFeedback) => {
    return axiosClient.post<any>(
      `${prefixCustomerService}/feedback/open-feedback`,
      data
    );
  },

  progressFeedback: (data: any) => {
    const formData = new FormData();
    formData.append(
      'ids',
      new Blob([JSON.stringify(data.ids)], { type: 'application/json' })
    );
    formData.append(
      'departmentCode',
      new Blob([data.departmentCode], { type: 'application/json' })
    );
    formData.append(
      'description',
      new Blob([data.content], { type: 'application/json' })
    );
    data.fileList?.forEach((file: any) => {
      formData.append('files', file);
    });
    return axiosClient.post<any>(
      `${prefixCustomerService}/feedback/confirm-is-handled`,
      formData
    );
  },

  closeFeedback: (data: IChangeStatusFeedback) => {
    return axiosClient.post<any>(
      `${prefixCustomerService}/feedback/close-feedback`,
      data
    );
  },

  cancelFeedback: (data: IChangeStatusFeedback) => {
    return axiosClient.post<any>(
      `${prefixCustomerService}/feedback/cancel-feedback`,
      data
    );
  },

  approveFeedback: (data: IChangeStatusFeedback) => {
    return axiosClient.post<any>(
      `${prefixCustomerService}/feedback/approve-feedback`,
      data
    );
  },

  acceptFeedback: (data: IChangeStatusFeedback) => {
    return axiosClient.post<any>(
      `${prefixCustomerService}/feedback/accept-feedback`,
      data
    );
  },

  getAllPriority: () => {
    return axiosClient.get<any[]>(
      `${prefixCustomerService}/feedback-type/search`
    ) as any;
  },

  getPrioritById: (params: { feedbackTypeId: number }) => {
    const res: any = axiosClient.get<any>(
      `${prefixCustomerService}/feedback-type/sla-config`,
      { params }
    );
    return res;
  },

  checkFeedbackCount: (params: { feedbackTypeId: number; isdn: number }) => {
    const res: any = axiosClient.get<any>(
      `${prefixCustomerService}/feedback-request/check-feedback-by-isdn-and-type`,
      { params }
    );
    return res;
  },

  getFeedbackTypeDetail: (params: { id: number }) => {
    const res: any = axiosClient.get<any>(
      `${prefixCustomerService}/feedback-type/${params.id}`
    );
    return res;
  },
  checkIsdnStatus: (params: { isdn?: string[] }) => {
    const res: any = axiosClient.get<any>(
      `${prefixCustomerService}/feedback-request/get-list-isdn-status?isdn=${params.isdn?.join(
        ','
      )}`
    );
    return res;
  },
  getListChannelFeedback: () => {
    const res: any = axiosClient.post<IListChannelFeedback[]>(
      `${prefixCustomerService}/get-application-config?type=FEEDBACK_CHANNEL`
    );
    return res;
  },
};
