import { CTable, NotificationSuccess } from '@react/commons/index';
import { Text, TitleHeader } from '@react/commons/Template/style';
import { ActionsTypeEnum, DateFormat } from '@react/constants/app';
import { decodeSearchParams, queryParams } from '@react/helpers/utils';
import { useQueryClient } from '@tanstack/react-query';
import { Dropdown, Row } from 'antd';
import { TableProps } from 'antd/lib';
import { ReactComponent as IconMore } from 'apps/Internal/src/assets/images/IconMore.svg';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useGetDepartments } from '../../UserManagement/queryHooks';
import { FilterAction } from '../components/FilterAction';
import ReasonModal from '../components/ReasonModal';
import SelectDepartmentModal from '../components/SelectDepartmentModal';
import { getCollumnTable, isOverDate } from '../constants';
import {
  useApproveFeedback,
  useCancelFeedback,
  useCloseFeedback,
  useExportMutationBO,
  useListFeedbackBO,
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

/**
 * @author
 * @function @FeedbackCSKH
 **/

const FeedbackBO = () => {
  const {
    setSelectedKeys,
    selectedKeys,
    setOpenReasonModal,
    isOpenReasonModal,
    setOpenDepartmentModal,
    isOpenDepartmentModal,
    selectedFeedback,
    setSelectedFeedback,
  } = useFeedbackStore();
  const { data: INTERNAL_DEPARTMENT = [] } = useGetDepartments();
  const [searchParams] = useSearchParams({
    fromDate: dayjs().subtract(29, 'd').format(DateFormat.DEFAULT),
    toDate: dayjs().format(DateFormat.DEFAULT),
  });
  const params = decodeSearchParams(searchParams);
  const { page, size } = params;
  const { data, isFetching } = useListFeedbackBO(queryParams(params));
  const client = useQueryClient();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { mutate: cancelFeedback, isPending: confirmLoadingCancelFeedback } =
    useCancelFeedback(() => {
      NotificationSuccess('Hủy phản ánh thành công');
      client.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.SEARCH_FEEDBACK_BO],
      });
      setOpenReasonModal(false, []);
      setSelectedKeys([]);
    });
  const { mutate: rejectFeedback, isPending: confirmLoadingRejectFeedback } =
    useRejectFeedback(() => {
      NotificationSuccess('Từ chối yêu cầu phản ánh thành công');
      client.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.SEARCH_FEEDBACK_BO],
      });
      setOpenReasonModal(false, []);
      setSelectedKeys([]);
    });
  const { mutate: closeFeedback, isPending: confirmLoadingCloseFeedback } =
    useCloseFeedback((data: any) => {
      NotificationSuccess(
        `Đóng ${data?.message}/${selectedKeys.length} yêu cầu phản ánh thành công`
      );
      client.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.SEARCH_FEEDBACK_BO],
      });
      setOpenReasonModal(false, []);
      setSelectedKeys([]);
    });
  const { mutate: openFeedback, isPending: confirmLoadingOpenFeedback } =
    useOpenFeedback(() => {
      NotificationSuccess('Mở phản ánh thành công');
      setOpenReasonModal(false, []);
      setSelectedKeys([]);
      client.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.SEARCH_FEEDBACK_BO],
      });
    });
  const { mutate: sendMail } = useSendEmailFeedback(() => {
    NotificationSuccess('Gửi mail nhắc nhở thành công');
  });
  const handleApprove = (record: IFeedback) => {
    setOpenDepartmentModal(true, [record.id]);
  };
  const { mutate: approveFeedback, isPending: confirmLoadingApproveFeedback } =
    useApproveFeedback(() => {
      NotificationSuccess('Duyệt phản ánh thành công');
      setOpenDepartmentModal(false, []);
      setSelectedKeys([]);
      client.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.SEARCH_FEEDBACK_BO],
      });
    });

  const rowSelection: TableProps<any>['rowSelection'] = {
    selectedRowKeys: selectedKeys,
    onChange: (selectedRowKeys: React.Key[], selected: IFeedback[]) => {
      setSelectedFeedback(selected);
      setSelectedKeys(selectedRowKeys);
    },
    getCheckboxProps: (record: IFeedback) => ({
      disabled: [StatusEnum.CLOSED, StatusEnum.CANCELED].includes(
        record.status
      ),
    }),
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
        isBO: true,
      });
    }
    if (type === 'reject') {
      rejectFeedback({
        feedbackIds: ids,
        departmentCode: null,
        note: values?.description,
        reasonCode: values?.reason,
      });
    }
    if (type === 'open') {
      openFeedback({
        feedbackIds: ids,
        departmentCode: null,
        // note: values?.description,
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
  };

  const handleDetail = async (record: IFeedback) => {
    navigate(pathRoutes.feedbackRouteView(pathname, record.id.toString()));
  };

  const handleExport = () => {
    downloadFile({ params, fileName: 'Danh_sach_yeu_cau_BO' });
  };
  const { mutate: downloadFile } = useExportMutationBO();

  useEffect(() => {
    setSelectedKeys([]);
    setSelectedFeedback([]);
  }, []);

  const handleCancel = (record: IFeedback) => {
    setOpenReasonModal(true, [record.id], 'cancel');
  };

  const handleReject = (record: IFeedback) => {
    setOpenReasonModal(true, [record.id], 'reject');
  };

  const handleOpenFeedback = (record: IFeedback) => {
    setOpenReasonModal(true, [record.id], 'open');
  };

  const handleCloseFeedback = (record: IFeedback) => {
    setSelectedFeedback([record]);
    setOpenReasonModal(true, [record.id], 'close');
  };

  const items = (record: IFeedback) =>
    [
      {
        key: ActionsTypeEnum.UPDATE,
        onClick: () => {
          navigate(
            pathRoutes.feedbackRouteEdit(pathname, record.id.toString())
          );
        },
        label: <Text>Chỉnh sửa yêu cầu</Text>,
        isShow: ![StatusEnum.CLOSED, StatusEnum.CANCELED].includes(
          record?.status as StatusEnum
        ),
      },
      {
        key: ActionsTypeEnum.SEND_MAIL,
        onClick: () => {
          sendMail({
            type: record.departmentCode
              ? FeedbackDestinationEnum.HANDLE
              : FeedbackDestinationEnum.APPROVE,
            id: record.id,
          });
        },
        label: <Text>Gửi mail nhắc nhở</Text>,
        isShow: isOverDate(record) && record.status === StatusEnum.PENDING,
      },
      {
        key: 'APPROVAL',
        onClick: () => {
          handleApprove(record);
        },
        label: <Text>Phê duyệt</Text>,
        isShow: record?.status === StatusEnum.APPROVING,
      },
      {
        key: ActionsTypeEnum.CANCEL,
        onClick: () => handleCancel(record),
        label: <Text>Hủy</Text>,
        isShow:
          record?.status == StatusEnum.PROCESSING ||
          record?.status == StatusEnum.PENDING ||
          record?.status == StatusEnum.APPROVING ||
          record?.status == StatusEnum.REJECTED,
      },
      {
        key: ActionsTypeEnum.REJECT,
        onClick: () => handleReject(record),
        label: <Text type="danger">Từ chối</Text>,
        isShow: record?.status == StatusEnum.APPROVING,
      },
      {
        key: ActionsTypeEnum.CLOSE,
        onClick: () => handleCloseFeedback(record),
        label: <Text>Đóng phản ánh</Text>,
        isShow:
          record?.status !== StatusEnum.CLOSED &&
          record?.status !== StatusEnum.CANCELED,
      },
      {
        key: ActionsTypeEnum.REOPEN,
        onClick: () => handleOpenFeedback(record),
        label: <Text>Mở lại</Text>,
        isShow: record?.status == StatusEnum.PROCESSED,
      },
    ].filter((e) => e.isShow);

  return (
    <Wrapper id="wrapperFeedbackManager">
      <TitleHeader id="filterFeedbackManager">
        Danh sách yêu cầu phản ánh (BO)
      </TitleHeader>
      <div className="flex flex-col">
        <FilterAction type={PageFilterEnum.BO} onExport={handleExport} />
        <Row>
          <CTable
            columns={getCollumnTable({
              INTERNAL_DEPARTMENT,
              handleDetail,
              more: (record) => (
                <Dropdown
                  menu={{ items: items(record) }}
                  placement="bottom"
                  trigger={['click']}
                >
                  <IconMore className="iconMore" />
                </Dropdown>
              ),
            })}
            dataSource={data?.content || []}
            loading={isFetching}
            rowKey={'id'}
            pagination={{
              current: +page + 1,
              pageSize: +size,
              total: data?.numberOfElements || 0,
            }}
            rowSelection={{ ...rowSelection }}
          />
        </Row>
      </div>
      {isOpenReasonModal && (
        <ReasonModal
          onSubmit={handleSubmitReason}
          type={PageFilterEnum.BO}
          confirmLoading={
            confirmLoadingCancelFeedback ||
            confirmLoadingRejectFeedback ||
            confirmLoadingOpenFeedback ||
            confirmLoadingCloseFeedback
          }
          selectedFeedback={selectedFeedback}
        />
      )}
      {isOpenDepartmentModal && (
        <SelectDepartmentModal
          onSubmit={(values: any, ids: string[]) => {
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

export default FeedbackBO;
