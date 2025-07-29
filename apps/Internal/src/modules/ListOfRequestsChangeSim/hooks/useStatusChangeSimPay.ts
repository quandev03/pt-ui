import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import useStoreListOfRequestsChangeSim from '../store';
import {
  NotificationError,
  NotificationSuccess,
} from '@react/commons/Notification';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';
import { useChangeSimActivate } from './useChangeSimActivate';
import { PayStatusEnum } from '../types';

export interface Res {
  payStatus: number;
}

export interface Req {
  requestId: string;
  check: boolean;
}

const fetcher = (body: Req) => {
  return axiosClient.get<Req, Res>(
    `${prefixCustomerService}/change-sim/pay/status/${body.requestId}/${body.check}`
  );
};

export const useStatusChangeSimPay = (clickOnAction = false) => {
  const { formAntd, interval, changeSimCode } =
    useStoreListOfRequestsChangeSim();
  const { mutate: mutateChangeSimActivate } = useChangeSimActivate();
  return useMutation({
    mutationFn: fetcher,
    onSuccess: (data) => {
      if (data.payStatus === PayStatusEnum.PAID) {
        NotificationSuccess('Thanh toán đơn hàng thành công');
        clearTimeout(interval);
        formAntd.setFieldsValue({
          paySuccess: 'true',
          status: 0, //  0 Chưa xử lý
          payStatus: '1', //  1 Đã thanh toán
        });

        setTimeout(() => {
          mutateChangeSimActivate({
            requestId: changeSimCode,
          });
        }, 5000);
      }
      if (clickOnAction) {
        if (data.payStatus === PayStatusEnum.PAY_FAILED) {
          NotificationError('Thanh toán đơn hàng thất bại');
        } else if (data.payStatus === PayStatusEnum.WAITING_PAY) {
          NotificationError(
            'Đơn hàng chưa được thanh toán.Vui lòng kiểm tra lại'
          );
        }
      }
    },
  });
};
