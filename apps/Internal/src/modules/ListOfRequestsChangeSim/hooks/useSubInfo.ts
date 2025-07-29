import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import useStoreListOfRequestsChangeSim from '../store';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';
import { ImageCode, ImageType } from '@react/constants/app';
import { useNavigate } from 'react-router-dom';
import { pathRoutes } from 'apps/Internal/src/constants/routes';

export interface ParamSubInfo {
  changeSimCode: string;
  isdn: string;
}

export interface FileInfoItem {
  fileCode: string;
  filePath: string;
  fileType: string;
}

export interface SubInfoResponse {
  changeSimNo: string;
  customerCode: string;
  oldSerialSim: string;
  fileInfos: FileInfoItem[];
}

const fetcher = (body: ParamSubInfo) => {
  return axiosClient.get<ParamSubInfo, SubInfoResponse>(
    `${prefixCustomerService}/change-sim/sub-info/${body.isdn?.substring(1)}/${
      body.changeSimCode
    }`
  );
};

export const useSubInfo = () => {
  const { formAntd: form, setCheckSubInfo } = useStoreListOfRequestsChangeSim();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: fetcher,
    onSuccess: (res) => {
      if (res.changeSimNo) {
        return navigate(
          pathRoutes.listOfRequestsChangeSimView(res.changeSimNo)
        );
      }
      setCheckSubInfo(true);
      const getImageUrl = (fileType: string, fileCode?: string) => {
        const listImg = res?.fileInfos || [];
        const image = listImg.find(
          (item) =>
            item.fileType === fileType &&
            (fileCode ? item.fileCode === fileCode : true)
        );
        return image ? image.filePath : '';
      };
      form.setFieldsValue({
        customerCode: res?.customerCode,
        oldSerialSim: res?.oldSerialSim,
        cardFrontOld: getImageUrl(ImageType.CCCD, ImageCode.FRONT),
        cardBackOld: getImageUrl(ImageType.CCCD, ImageCode.BACK),
        portraitOld:
          getImageUrl(ImageType.CCCD, ImageCode.PORTRAIT) ||
          getImageUrl(ImageType.CCCD, ImageCode.INCLINE_PORTRAIT),
        cardContractOld: getImageUrl(ImageType.HD),
      });
    },
    onError: () => {
      setCheckSubInfo(false);
    },
  });
};
