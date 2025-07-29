import { default as Button, default as CButton } from '@react/commons/Button';
import { NotificationSuccess } from '@react/commons/Notification';
import { TitleHeader } from '@react/commons/Template/style';
import { FormInstance } from 'antd/lib';
import { FC, useCallback, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FormFeedback } from '../components/FormFeedback';
import ReasonModal from '../components/ReasonModal';
import {
  isAdd,
  isEdit,
  isOverDate,
  isShowCancelBtn,
  isShowEditBtn,
  isView,
} from '../constants';
import {
  useCancelFeedback,
  useCreateFeedback,
  useSendEmailFeedback,
} from '../queryHooks';
import useFeedbackStore from '../store';
import {
  FeedbackDestinationEnum,
  IFeedback,
  ModalTypeReason,
  PageFilterEnum,
  StatusEnum,
} from '../types';
import { Wrapper } from './styles';

interface IProps {
  title: string;
}

/**
 * @author
 * @function @FeedbackAddViewEditCSKH
 **/

export const FeedbackAddViewEditCSKH: FC<IProps> = ({ title }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const { mutate: createFeedback, isPending: isLoadingCreate } =
    useCreateFeedback(
      () => {
        NotificationSuccess('Thêm mới yêu cầu phản ánh thành công');
        navigate(-1);
        setIsSubmitting(false);
      },
      () => {
        setIsSubmitting(false);
      }
    );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isOpenReasonModal, setOpenReasonModal } = useFeedbackStore();
  const { mutate: sendMail } = useSendEmailFeedback(() => {
    NotificationSuccess('Gửi mail nhắc nhở thành công');
  });
  const handleNavigateToEdit = () => {
    const path = pathname.replace('view', 'edit');
    navigate(path);
  };

  const { mutate: cancelFeedback, isPending: confirmLoadingCancelFeedback } =
    useCancelFeedback(() => {
      NotificationSuccess('Hủy phản ánh thành công');
      setOpenReasonModal(false, []);
      navigate(-1);
    });
  const handleSubmitForm = useCallback(
    async (form: FormInstance) => {
      try {
        if (isSubmitting) return;
        await form.validateFields();
        setIsSubmitting(true);
        form.submit();
      } catch (error) {
        console.error('Validation error:', error);
      }
    },
    [isSubmitting]
  );
  const handleSendMail = (record: IFeedback) => {
    sendMail({
      type: FeedbackDestinationEnum.APPROVE,
      id: record.id,
    });
  };

  const handleSubmitReason = (
    values: { reason: string; description?: string },
    ids: number[],
    type: ModalTypeReason
  ) => {
    if (type === 'cancel') {
      cancelFeedback({
        feedbackIds: ids,
        departmentCode: null,
        note: values?.description,
        reasonCode: values?.reason,
        isBO: false,
      });
    }
  };

  const handleCancel = (record: IFeedback) => {
    setOpenReasonModal(true, [record.id], 'cancel');
  };

  // Create a ref with the defined type
  return (
    <Wrapper id="wrapperFeedbackManager">
      <TitleHeader id="filterFeedbackManager">{title}</TitleHeader>
      <FormFeedback
        isLoadingCreate={isLoadingCreate}
        createFeedback={createFeedback}
        type={PageFilterEnum.CSKH}
        footer={(feedbackRequestResponseDTO, form) => (
          <>
            {isOverDate(feedbackRequestResponseDTO) &&
              isView(pathname) &&
              [StatusEnum.APPROVING].includes(
                feedbackRequestResponseDTO?.status as StatusEnum
              ) && (
                <>
                  <div className="flex items-center">
                    Phản ánh bị quá hạn duyệt
                  </div>
                  <Button
                    danger
                    onClick={() => handleSendMail(feedbackRequestResponseDTO)}
                  >
                    Gửi mail nhắc nhở
                  </Button>
                </>
              )}
            {isShowEditBtn(feedbackRequestResponseDTO) && isView(pathname) && (
              <Button onClick={handleNavigateToEdit}>
                Chỉnh sửa/tích tăng
              </Button>
            )}
            {isAdd(pathname) && (
              <CButton
                loading={isSubmitting}
                onClick={() => handleSubmitForm(form)}
              >
                Tạo yêu cầu
              </CButton>
            )}
            {isEdit(pathname) && (
              <CButton onClick={() => handleSubmitForm(form)}>Lưu</CButton>
            )}

            {isShowCancelBtn(feedbackRequestResponseDTO) &&
              isView(pathname) && (
                <Button
                  danger
                  onClick={() => handleCancel(feedbackRequestResponseDTO)}
                >
                  Huỷ
                </Button>
              )}
          </>
        )}
      />
      {isOpenReasonModal && (
        <ReasonModal
          onSubmit={handleSubmitReason}
          confirmLoading={confirmLoadingCancelFeedback}
        />
      )}
    </Wrapper>
  );
};
