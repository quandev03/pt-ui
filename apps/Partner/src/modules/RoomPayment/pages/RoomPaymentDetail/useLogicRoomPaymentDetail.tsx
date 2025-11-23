import { useCallback, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetRoomPaymentDetail } from '../../hooks';
import { NotificationSuccess, NotificationError } from '@vissoft-react/common';
import { roomPaymentServices } from '../../services';

export const useLogicRoomPaymentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: paymentDetail, isLoading: loadingDetail } =
    useGetRoomPaymentDetail(id);
  const [loadingResendEmail, setLoadingResendEmail] = useState(false);

  const handleClose = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handlePrintInvoice = useCallback(() => {
    // TODO: Implement print invoice functionality
    window.print();
  }, []);

  const handleResendEmail = useCallback(async () => {
    if (!id) {
      NotificationError({
        message: 'Không tìm thấy ID thanh toán',
      });
      return;
    }

    try {
      setLoadingResendEmail(true);
      await roomPaymentServices.resendEmail(id);
      NotificationSuccess('Đã gửi lại email thành công');
    } catch (error) {
      NotificationError({
        message: 'Gửi lại email thất bại',
      });
    } finally {
      setLoadingResendEmail(false);
    }
  }, [id]);

  return {
    paymentDetail,
    loadingDetail,
    loadingResendEmail,
    handleClose,
    handlePrintInvoice,
    handleResendEmail,
  };
};




