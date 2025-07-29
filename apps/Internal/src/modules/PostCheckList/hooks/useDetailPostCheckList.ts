import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { urlPostCheckList } from '../services/url';
import { IDataPostCheckListDetail } from '../types';
import useStorePostCheckList from '../store';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';

const fetcher = (id: string) => {
  return axiosClient.get<any, IDataPostCheckListDetail>(
    `${urlPostCheckList}/detail-audit-sub/${id}`
  );
};

export const useDetailPostCheckList = (id: string) => {
  const { setObjectImage } = useStorePostCheckList();

  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_DETAIL_POST_CHECK_LIST, id],
    queryFn: () => fetcher(id),
    enabled: !!id,
    select: (data) => {
      const imageResponseDTOList = data.imageResponseDTOList;
      const initialImage = {
        cardFront: '',
        cardBack: '',
        selfie: '',
        contract: '',
        regulation13: '',
      };

      if (!imageResponseDTOList || !imageResponseDTOList.length) {
        return { ...data, ...initialImage };
      }

      const objectImage = imageResponseDTOList.reduce((acc, item: any) => {
        if (item.imageType === '1') {
          if (item.imageCode === '1') {
            acc.cardFront = item.imagePath;
          } else if (item.imageCode === '2') {
            acc.cardBack = item.imagePath;
          } else if (item.imageCode === '3' || item.imageCode === '4') {
            acc.selfie = item.imagePath;
          }
        } else if (item.imageType === '2') {
          acc.contract = item.imagePath;
        } else if (item.imageType === '3') {
          acc.regulation13 = item.imagePath;
        }
        return acc;
      }, initialImage);

      return { ...data, ...objectImage };
    },
  });
};
