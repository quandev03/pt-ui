import { useQuery } from '@tanstack/react-query';
import { ObjectType } from '../types';
import { prefixAuthService } from 'apps/Internal/src/constants';
import { safeApiClient } from 'apps/Internal/src/services';

export const queryKeyListObject = 'query-list-object-thucnv';

const fetcher = (isPartner: boolean, isMobile?: boolean) => {
  return safeApiClient.get<ObjectType[]>(
    `${prefixAuthService}/api/objects?isPartner=${isPartner}${
      isMobile ? '&isMobile=true' : '&isMobile=false'
    }`
  );
};

export const useListObject = (isPartner: boolean, isMobile?: boolean) => {
  return useQuery({
    queryFn: () => fetcher(isPartner, isMobile),
    queryKey: [queryKeyListObject, isPartner, isMobile],
    select: (data: ObjectType[] = []) => {
      const result: ObjectType[] = [];
      const getSubData = (data: ObjectType[]) => {
        data?.forEach(({ children, ...rest }) => {
          if (!children) return;
          result.push({
            ...rest,
            isChildren: children[0]?.children ? 'Yes' : 'No',
          });
          getSubData(children);
        });
      };
      getSubData(data);
      return result;
    },
    enabled: true,
  });
};
