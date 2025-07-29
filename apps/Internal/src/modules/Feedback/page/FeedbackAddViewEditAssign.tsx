import { Button } from '@react/commons/index';
import { NotificationSuccess } from '@react/commons/Notification';
import { TitleHeader } from '@react/commons/Template/style';
import { Spin } from 'antd';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormFeedback } from '../components/FormFeedback';
import ProgressModal from '../components/ProgressModal';
import ReasonModal from '../components/ReasonModal';
import { isOverDate } from '../constants';
import {
  useAcceptFeedback,
  useProgressFeedback,
  useRejectFeedback,
  useSendEmailFeedback,
  useUserDepartmentCode
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
 * @function @FeedbackAddViewEditAssign
 **/

export const FeedbackAddViewEditAssign: FC<IProps> = ({ title }) => {
  const {
    isOpenReasonModal,
    setOpenReasonModal,
    handleToggleReload,
    isOpenProgressModal,
    setOpenProgressModal,
  } = useFeedbackStore();
  const navigate = useNavigate();
  const departmentCode = useUserDepartmentCode();
  const { mutate: rejectFeedback, isPending: confirmLoadingRejectFeedback } =
    useRejectFeedback(() => {
      NotificationSuccess('Từ chối yêu cầu phản ánh thành công', 5000);
      setOpenReasonModal(false, []);
      handleToggleReload();
      navigate(-1);
    });
  const { mutate: sendMail, isPending: isLoadingSendMail } =
    useSendEmailFeedback(() => {
      NotificationSuccess('Gửi mail nhắc nhở thành công', 5000);
    });

  const { mutate: acceptFeedback, isPending: isPendingAcceptFeedback } =
    useAcceptFeedback(() => {
      NotificationSuccess('Tiếp nhận yêu cầu phản ánh thành công', 5000);
      setOpenReasonModal(false, []);
      handleToggleReload();
      navigate(-1);
    });

  const { mutate: progressFeedback, isPending: isPendingProgressFeedback } =
    useProgressFeedback(() => {
      NotificationSuccess('Đã xử lý yêu cầu phản ánh thành công', 5000);
      setOpenProgressModal(false, []);
      handleToggleReload();
      navigate(-1);
    });

  const handleSubmitReason = (
    values: { reason: string; description?: string },
    ids: number[],
    type: ModalTypeReason
  ) => {
    if (type === 'reject') {
      rejectFeedback({
        feedbackIds: ids,
        departmentCode: departmentCode,
        note: values?.description,
        reasonCode: values?.reason,
      });
    }
  };

  const handleAcceptFeedback = (record: IFeedback) => {
    acceptFeedback({
      feedbackIds: [record?.id],
      departmentCode: departmentCode,
    });
  };

  const handleRejectFeedback = (record: IFeedback) => {
    setOpenReasonModal(true, [record.id], 'reject');
  };

  const handleSubmitProgress = (
    values: any,
    fileList: any[],
    ids: number[]
  ) => {
    const formData = {
      ids,
      departmentCode,
      content: values?.content,
      fileList,
    };
    progressFeedback(formData);
  };

  const handleSendMail = (record: IFeedback) => {
    sendMail({
      type: FeedbackDestinationEnum.HANDLE,
      id: record.id,
    });
  };

  return (
    <Spin spinning={isLoadingSendMail}>
      <Wrapper id="wrapperFeedbackManager">
        <TitleHeader id="filterFeedbackManager">{title}</TitleHeader>
        <FormFeedback
          type={PageFilterEnum.ASSIGNED}
          footer={(feedbackRequestResponseDTO, form) => (
            <>
              {isOverDate(feedbackRequestResponseDTO) &&
                feedbackRequestResponseDTO.status === StatusEnum.PROCESSED && (
                  <>
                    <div className="flex items-center">
                      Phản ánh bị quá hạn đóng
                    </div>
                    <Button
                      danger
                      onClick={() => handleSendMail(feedbackRequestResponseDTO)}
                    >
                      Gửi mail nhắc nhở
                    </Button>
                  </>
                )}
              {[StatusEnum.PENDING, StatusEnum.REPROCESS].includes(
                feedbackRequestResponseDTO?.status
              ) && (
                  <Button
                    loading={isPendingAcceptFeedback}
                    onClick={() =>
                      handleAcceptFeedback(feedbackRequestResponseDTO)
                    }
                  >
                    Tiếp nhận
                  </Button>
                )}
              {[
                StatusEnum.PENDING,
                StatusEnum.PROCESSING,
                StatusEnum.REPROCESS,
              ].includes(feedbackRequestResponseDTO?.status) && (
                  <Button
                    onClick={() => {
                      setOpenProgressModal(true, [feedbackRequestResponseDTO.id]);
                    }}
                  >
                    Đã xử lý
                  </Button>
                )}
              {[StatusEnum.PENDING].includes(
                feedbackRequestResponseDTO?.status
              ) && (
                  <Button
                    danger
                    onClick={() => {
                      handleRejectFeedback(feedbackRequestResponseDTO);
                    }}
                  >
                    Từ chối
                  </Button>
                )}
            </>
          )}
        />
        {isOpenReasonModal && (
          <ReasonModal
            onSubmit={handleSubmitReason}
            confirmLoading={confirmLoadingRejectFeedback}
          />
        )}
        {isOpenProgressModal && (
          <ProgressModal
            onSubmit={handleSubmitProgress}
            confirmLoading={isPendingProgressFeedback}
          />
        )}
      </Wrapper>
    </Spin>
  );
};
