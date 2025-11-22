import { useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetRoomPaymentDetail } from '../../hooks';
import { pathRoutes } from '../../../../routers';
import { NotificationSuccess } from '@vissoft-react/common';

export const useLogicRoomPaymentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: paymentDetail, isLoading: loadingDetail } =
    useGetRoomPaymentDetail(id);

  const handleClose = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handlePrintInvoice = useCallback(() => {
    // TODO: Implement print invoice functionality
    window.print();
  }, []);

  const handleResendEmail = useCallback(() => {
    // TODO: Implement resend email functionality
    NotificationSuccess('Đã gửi lại email thành công');
  }, []);

  return {
    paymentDetail,
    loadingDetail,
    handleClose,
    handlePrintInvoice,
    handleResendEmail,
  };
};

