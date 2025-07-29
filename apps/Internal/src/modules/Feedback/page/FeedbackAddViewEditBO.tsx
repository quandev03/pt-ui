import Button from '@react/commons/Button';
import { NotificationSuccess } from '@react/commons/Notification';
import { TitleHeader } from '@react/commons/Template/style';
import { FormInstance } from 'antd/lib';
import { FC, useCallback, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGetDepartments } from '../../UserManagement/queryHooks';
import { FormFeedback } from '../components/FormFeedback';
import ReasonModal from '../components/ReasonModal';
import SelectDepartmentModal from '../components/SelectDepartmentModal';
import {
  isAdd,
  isEdit,
  isOverDate,
  isShowCancelBtn,
  isShowEditBtn,
  isView,
} from '../constants';
import {
  useApproveFeedback,
  useCancelFeedback,
  useCloseFeedback,
  useCreateFeedback,
  useOpenFeedback,
  useRejectFeedback,
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
 * @function @FeedbackAddViewEditBO
 **/
interface FormFeedbackRef {
  isLoadingCreate: boolean;
  isLoadingEdit: boolean;
}
export const FeedbackAddViewEditBO: FC<IProps> = ({ title }) => {
  const { pathname } = useLocation();
  const {
    setOpenReasonModal,
    setOpenDepartmentModal,
    isOpenReasonModal,
    isOpenDepartmentModal,
    handleToggleReload,
    selectedFeedback,
    setSelectedFeedback,
  } = useFeedbackStore();
  const navigate = useNavigate();
  const { data: INTERNAL_DEPARTMENT = [] } = useGetDepartments();
  const { mutate: sendMail } = useSendEmailFeedback(() => {
    NotificationSuccess('Gửi mail nhắc nhở thành công');
  });
  const { mutate: createFeedback, isPending: isLoadingCreate } =
    useCreateFeedback(() => {
      NotificationSuccess('Thêm mới yêu cầu phản ánh thành công');
      navigate(-1);
      setIsSubmitting(false);
    }, () => {
      setIsSubmitting(false);
    });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutate: rejectFeedback, isPending: confirmLoadingRejectFeedback } =
    useRejectFeedback(() => {
      NotificationSuccess('Từ chối yêu cầu phản ánh thành công');
      setOpenReasonModal(false, []);
      handleToggleReload();
    });
  const { mutate: closeFeedback, isPending: confirmLoadingCloseFeedback } =
    useCloseFeedback(() => {
      NotificationSuccess('Đóng phản ánh thành công');
      setOpenReasonModal(false, []);
      handleToggleReload();
    });
  const { mutate: openFeedback, isPending: confirmLoadingOpenFeedback } =
    useOpenFeedback(() => {
      NotificationSuccess('Mở phản ánh thành công');
      setOpenReasonModal(false, []);
      handleToggleReload();
    });
  const { mutate: approveFeedback, isPending: confirmLoadingApproveFeedback } =
    useApproveFeedback(() => {
      NotificationSuccess('Duyệt phản ánh thành công');
      setOpenDepartmentModal(false, []);
      setOpenReasonModal(false, []);
      handleToggleReload();
    });

  const { mutate: cancelFeedback, isPending: confirmLoadingCancelFeedback } =
    useCancelFeedback(() => {
      NotificationSuccess('Hủy phản ánh thành công');
      setOpenReasonModal(false, []);
      navigate(-1);
    });

  const handleNavigateToEdit = () => {
    const path = pathname.replace('view', 'edit');
    console.log('path :', path);
    navigate(path);
  };

  const handleSubmitForm = useCallback(async (form: FormInstance) => {
    try {
      if (isSubmitting) return;
      await form.validateFields();
      setIsSubmitting(true);
      form.submit();
    } catch (error) {
      console.error('Validation error:', error);
    }
  }, [isSubmitting]);

  const handleSendMail = (record: IFeedback) => {
    sendMail({
      type: FeedbackDestinationEnum.HANDLE,
      id: record.id,
    });
  };

  const handleReject = (record: IFeedback) => {
    setOpenReasonModal(true, [record.id], 'reject');
  };

  const handleApprove = (record: IFeedback) => {
    setOpenDepartmentModal(true, [record.id]);
  };

  const handleOpenFeedback = (record: IFeedback) => {
    setOpenReasonModal(true, [record.id], 'open');
  };

  const handleCloseFeedback = (record: IFeedback) => {
    setSelectedFeedback([record]);
    setOpenReasonModal(true, [record.id], 'close');
  };

  const handleSubmitReason = (
    values: {
      reason: string;
      description?: string;
      message?: string;
      note?: string;
    },
    ids: number[],
    type: ModalTypeReason
  ) => {
    if (type === 'reject') {
      rejectFeedback({
        feedbackIds: ids,
        departmentCode: null,
        note: values?.description,
        reasonCode: values?.reason,
      });
    }
    if (type === 'close') {
      closeFeedback({
        feedbackIds: ids,
        departmentCode: null,
        ...values,
      });
    }
    if (type === 'open') {
      openFeedback({
        feedbackIds: ids,
        departmentCode: null,
        note: values?.description,
        reasonCode: values?.reason,
      });
    }
    if (type === 'cancel') {
      cancelFeedback({
        feedbackIds: ids,
        departmentCode: null,
        note: values?.description,
        reasonCode: values?.reason,
        isBO: true,
      });
    }
  };
  const handleCancel = (record: IFeedback) => {
    setOpenReasonModal(true, [record.id], 'cancel');
  };

  return (
    <Wrapper id="wrapperFeedbackManager">
      <TitleHeader id="filterFeedbackManager">{title}</TitleHeader>
      <FormFeedback
        isLoadingCreate={isLoadingCreate}
        createFeedback={createFeedback}
        type={PageFilterEnum.BO}
        footer={(feedbackRequestResponseDTO, form) => (
          <>
            {isOverDate(feedbackRequestResponseDTO) &&
              isView(pathname) &&
              feedbackRequestResponseDTO.status === StatusEnum.PENDING && (
                <>
                  <div className="flex items-center">
                    Phản ánh bị quá hạn xử lý
                  </div>
                  <Button
                    danger
                    onClick={() => handleSendMail(feedbackRequestResponseDTO)}
                  >
                    Gửi mail nhắc nhở
                  </Button>
                </>
              )}
            {feedbackRequestResponseDTO?.status === StatusEnum.APPROVING &&
              isView(pathname) && (
                <Button
                  onClick={() => handleApprove(feedbackRequestResponseDTO)}
                >
                  Phê duyệt
                </Button>
              )}
            {feedbackRequestResponseDTO?.status === StatusEnum.APPROVING &&
              isView(pathname) && (
                <Button
                  danger
                  onClick={() => handleReject(feedbackRequestResponseDTO)}
                >
                  Từ chối
                </Button>
              )}
            {feedbackRequestResponseDTO?.status !== StatusEnum.CLOSED &&
              feedbackRequestResponseDTO?.status !== StatusEnum.CANCELED &&
              isView(pathname) && (
                <Button
                  onClick={() =>
                    handleCloseFeedback(feedbackRequestResponseDTO)
                  }
                >
                  Đóng phản ánh
                </Button>
              )}
            {feedbackRequestResponseDTO?.status === StatusEnum.PROCESSED &&
              isView(pathname) && (
                <Button
                  onClick={() => handleOpenFeedback(feedbackRequestResponseDTO)}
                >
                  Mở lại
                </Button>
              )}
            {isShowEditBtn(feedbackRequestResponseDTO) && isView(pathname) && (
              <Button onClick={handleNavigateToEdit}>
                Chỉnh sửa/tích tăng
              </Button>
            )}
            {isAdd(pathname) && (
              <Button
                onClick={() => handleSubmitForm(form)}
              >
                Tạo yêu cầu
              </Button>
            )}
            {isEdit(pathname) && (
              <Button
                onClick={() => handleSubmitForm(form)}
              >
                Lưu
              </Button>
            )}

            {isShowCancelBtn(feedbackRequestResponseDTO, PageFilterEnum.BO) &&
              isView(pathname) && (
                <Button
                  danger
                  onClick={() => handleCancel(feedbackRequestResponseDTO)}
                >
                  Hủy
                </Button>
              )}
          </>
        )}
      />
      {isOpenReasonModal && (
        <ReasonModal
          type={PageFilterEnum.BO}
          onSubmit={handleSubmitReason}
          confirmLoading={
            confirmLoadingRejectFeedback ||
            confirmLoadingCloseFeedback ||
            confirmLoadingOpenFeedback ||
            confirmLoadingCancelFeedback
          }
          selectedFeedback={selectedFeedback}
        />
      )}
      {isOpenDepartmentModal && (
        <SelectDepartmentModal
          onSubmit={(values: any, ids: any[]) => {
            const departmentCode = values?.departmentCode;
            const departmentName =
              INTERNAL_DEPARTMENT?.find((e) => e.code === departmentCode)
                ?.label || departmentCode;

            return approveFeedback({
              feedbackIds: ids,
              departmentCode: [departmentCode],
              processor: values?.processor,
              departmentName: [departmentName],
            });
          }}
          confirmLoading={confirmLoadingApproveFeedback}
        />
      )}
    </Wrapper>
  );
};
