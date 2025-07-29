import { prefixReportService } from '@react/url/app';
import { useInfiniteQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { IParamsFeedbackCreator } from '../type';

const getFeedbackCreator = (params: IParamsFeedbackCreator) => {
  return axiosClient.get<any, any>(
    `${prefixReportService}/feedback/search-username-created-feedback`,
    { params }
  );
};
export const useInfinityFeedbackCreator = (params: IParamsFeedbackCreator) => {
  return useInfiniteQuery({
    queryKey: ['getInfinityFeedbackCreator', params],
    initialPageParam: params.page,
    queryFn: ({ pageParam = 0 }) => {
      return getFeedbackCreator({ ...params, page: pageParam });
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.last) {
        return undefined;
      }
      return lastPage.number + 1;
    },
    select: (data) => {
      const { pages } = data;
      const result: {
        label: string;
        value: string;
      }[] = [];
      pages.forEach((item) => {
        item.data.content.forEach((user: any) => {
          result.push({ label: user, value: user });
        });
      });
      return result;
    },
  });
};
