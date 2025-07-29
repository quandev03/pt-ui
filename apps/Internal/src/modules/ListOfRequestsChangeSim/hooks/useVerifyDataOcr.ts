import { prefixCustomerService } from '@react/url/app';
import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { Modal } from 'antd';
import useStoreListOfRequestsChangeSim from '../store';

export interface ParamVerifyDataOcr {
  changeSimCode: string;
  ocrData: {
    customerCode: string;
    idType: string;
    idNo: string;
    idIssuePlace: string;
    idIssueDate: string;
    name: string;
    sex: string;
    birthDate: string;
    nationality: string;
    address: string;
  };
}

const fetcher = (data: ParamVerifyDataOcr) => {
  return axiosClient.post<any, any>(
    `${prefixCustomerService}/change-sim/verify`,
    data
  );
};
export const useVerifyDataOcr = () => {
  const { formAntd } = useStoreListOfRequestsChangeSim();
  return useMutation({
    mutationFn: fetcher,
    onSuccess: (res) => {
      if (res?.success === false) {
        formAntd.setFieldsValue({
          isFakeOcr: true,
        });
        Modal.warning({
          centered: true,
          okText: 'Đóng',
          title:
            'Thông tin thuê bao không chính chủ. Vui lòng thực hiện cập nhật thông tin thuê bao trước khi thực hiện đổi SIM',
        });
      } else {
        formAntd.setFieldsValue({
          isFakeOcr: false,
        });
      }
    },
  });
};
