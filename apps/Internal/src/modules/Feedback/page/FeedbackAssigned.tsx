import React, { useEffect } from 'react';
import { Wrapper } from './styles';
import { Text, TitleHeader } from '@react/commons/Template/style';
import { FilterAction } from '../components/FilterAction';
import { Dropdown, Row, Spin } from 'antd';
import { CTable, NotificationSuccess } from '@react/commons/index';
import { getCollumnTable, isOverDate } from '../constants';
import {
  FeedbackDestinationEnum,
  IFeedback,
  ModalTypeReason,
  PageFilterEnum,
  StatusEnum,
} from '../types';
import useFeedbackStore from '../store';
import { TableProps } from 'antd/lib';
import {
  useAcceptFeedback,
  useListFeedbackAssign,
  useProgressFeedback,
  useRejectFeedback,
  useSendEmailFeedback,
  useUserDepartmentCode,
} from '../queryHooks';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { decodeSearchParams, queryParams } from '@react/helpers/utils';
import { ActionsTypeEnum, DateFormat } from '@react/constants/app';
import { ReactComponent as IconMore } from 'apps/Internal/src/assets/images/IconMore.svg';
import ReasonModal from '../components/ReasonModal';
import ProgressModal from '../components/ProgressModal';
import { useQueryClient } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { useGetDepartments } from '../../UserManagement/queryHooks';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import dayjs from 'dayjs';
import includes from 'lodash/includes';

/**
 * @author
 * @function @FeedbackAssigned
 **/

const FeedbackAssigned = () => {
  const {
    setSelectedKeys,
    isOpenReasonModal,
    isOpenProgressModal,
    setOpenReasonModal,
    setOpenProgressModal,
    setSelectedFeedback,
    selectedKeys,
  } = useFeedbackStore();
  const departmentCode = useUserDepartmentCode();
  const { data: INTERNAL_DEPARTMENT = [] } = useGetDepartments();
  const [searchParams] = useSearchParams({
    fromDate: dayjs().subtract(29, 'd').format(DateFormat.DEFAULT),
    toDate: dayjs().format(DateFormat.DEFAULT),
  });
  const params = decodeSearchParams(searchParams);
  const { page, size } = params;
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { data, isFetching } = useListFeedbackAssign(
    queryParams({ ...params, departmentCodeFilter: departmentCode })
  );
  const client = useQueryClient();
  const { mutate: rejectFeedback, isPending: confirmLoadingRejectFeedback } =
    useRejectFeedback((data) => {
      NotificationSuccess(
        selectedKeys.length > 0
          ? data.message
          : 'Từ chối yêu cầu phản ánh thành công',
        5000
      );
      setOpenReasonModal(false, []);
      client.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.SEARCH_FEEDBACK_ASSIGN],
      });
      setSelectedKeys([]);
    });

  const { mutate: sendMail, isPending: isPendingSendingEmail } =
    useSendEmailFeedback(() => {
      NotificationSuccess('Gửi mail nhắc nhở thành công');
    });

  const { mutate: acceptFeedback, isPending: isPendingAcceptFeedback } =
    useAcceptFeedback((data) => {
      NotificationSuccess(
        data.message ? data.message : 'Tiếp nhận yêu cầu phản ánh thành công',
        5000
      );

      setOpenReasonModal(false, []);
      client.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.SEARCH_FEEDBACK_ASSIGN],
      });
      setSelectedKeys([]);
    });

  const { mutate: progressFeedback } = useProgressFeedback((data) => {
    NotificationSuccess(
      selectedKeys.length > 0
        ? data.message
        : 'Đã xử lý yêu cầu phản ánh thành công',
      5000
    );
    setOpenProgressModal(false, []);
    setSelectedKeys([]);
    client.invalidateQueries({
      queryKey: [REACT_QUERY_KEYS.SEARCH_FEEDBACK_ASSIGN],
    });
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

  const handleDetail = async (record: IFeedback) => {
    navigate(pathRoutes.feedbackRouteView(pathname, record.id.toString()));
  };
  const rowSelection: TableProps<any>['rowSelection'] = {
    selectedRowKeys: selectedKeys,
    onChange: (selectedRowKeys: React.Key[], selected: IFeedback[]) => {
      setSelectedKeys(selectedRowKeys);
      setSelectedFeedback(selected);
    },
    getCheckboxProps: (record: IFeedback) => ({
      disabled: [StatusEnum.CLOSED, StatusEnum.CANCELED].includes(
        record.status
      ),
    }),
  };

  useEffect(() => {
    setSelectedKeys([]);
    setSelectedFeedback([]);
  }, []);

  const items = (record: IFeedback) =>
    [
      {
        key: ActionsTypeEnum.ACCEPT,
        onClick: () => {
          handleAcceptFeedback(record);
        },
        label: <Text>Tiếp nhận</Text>,
        isShow: includes(
          [StatusEnum.PENDING, StatusEnum.REPROCESS],
          record?.status
        ),
      },
      {
        key: ActionsTypeEnum.CONFIRM,
        onClick: () => {
          setOpenProgressModal(true, [record.id]);
        },
        label: <Text>Đã xử lý</Text>,
        isShow: includes(
          [StatusEnum.PROCESSING, StatusEnum.REPROCESS, StatusEnum.PENDING],
          record?.status
        ),
      },
      {
        key: ActionsTypeEnum.REJECT,
        onClick: () => handleRejectFeedback(record),
        label: <Text>Từ chối</Text>,
        isShow: record?.status == StatusEnum.PENDING,
      },
      {
        key: ActionsTypeEnum.SEND_MAIL,
        onClick: () => {
          sendMail({
            type: FeedbackDestinationEnum.CLOSE,
            id: record.id,
          });
        },
        label: <Text>Gửi mail nhắc nhở</Text>,
        isShow: record.status === StatusEnum.PROCESSED && isOverDate(record),
      },
    ].filter((e) => e.isShow);

  return (
    <Spin spinning={isPendingAcceptFeedback || isPendingSendingEmail}>
      <Wrapper id="wrapperFeedbackManager">
        <TitleHeader id="filterFeedbackManager">
          Danh sách yêu cầu phản ánh (Được phân công)
        </TitleHeader>
        <div className="flex flex-col">
          <FilterAction
            type={PageFilterEnum.ASSIGNED}
            spinning={isPendingAcceptFeedback}
          />
          <Row>
            <CTable
              columns={getCollumnTable({
                isAssigned: true,
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
            confirmLoading={confirmLoadingRejectFeedback}
          />
        )}
        {isOpenProgressModal && (
          <ProgressModal onSubmit={handleSubmitProgress} />
        )}
      </Wrapper>
    </Spin>
  );
};

export default FeedbackAssigned;
