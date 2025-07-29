import { CButtonClose } from '@react/commons/Button';
import CModal from '@react/commons/Modal';
import { StyledCommonTable } from '@react/commons/Table/styles';
import CTag from '@react/commons/Tag';
import { Text } from '@react/commons/Template/style';
import { ColorList } from '@react/constants/color';
import {
  formatDate,
  formatDateBe,
  formatDateTime,
} from '@react/constants/moment';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import { prefixApprovalServicePublic } from '@react/url/app';
import { useQuery } from '@tanstack/react-query';
import { Col, Row, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { ParamsOption } from 'apps/Internal/src/components/layouts/types';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { axiosClient } from 'apps/Internal/src/service';
import dayjs from 'dayjs';
import { FC, memo } from 'react';

export interface IPayloadViewProcessApproval {
  id?: number;
  objectName?: string;
  recordId?: number | string;
}

interface IDataViewProcessApproved {
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  id: number;
  approvalStepId: string;
  approvedDate: string;
  status: number;
  approvedUserId: string;
  description: string;
  approvalHistoryId: number;
  stepOrder: number;
  approvedUserName: string;
  mandatorUserId: string;
  mandatorUserName: string;
}

const mappingColor = {
  '1': ColorList.WAITING,
  '2': ColorList.SUCCESS,
  '3': ColorList.FAIL,
};

const fetcher = (payload: IPayloadViewProcessApproval) => {
  console.log('payload', payload);
  return axiosClient.post<string, IDataViewProcessApproved[]>(
    `${prefixApprovalServicePublic}/approval/approval-process-step`,
    payload
  );
};
export const useViewProcessApprovedKey = 'useViewProcessApprovedKey';
const useViewProcessApproved = (payload?: IPayloadViewProcessApproval) => {
  return useQuery({
    queryKey: [useViewProcessApprovedKey, payload],
    queryFn: () => fetcher(payload!),
    enabled: payload && !!payload.recordId,
  });
};

type Props = {
  open: boolean;
  onClose: () => void;
  objectName: string;
  id?: number | string;
};

const ModalViewApprovalProcess: FC<Props> = ({
  open,
  onClose,
  id,
  objectName,
}) => {
  const { data: dataTable, isLoading } = useViewProcessApproved({
    recordId: id,
    objectName,
  });

  const { APPROVAL_HISTORY_STEP_STATUS = [] } =
    useGetDataFromQueryKey<ParamsOption>([REACT_QUERY_KEYS.GET_PARAMS]);

  const columnsTableProcessApproved: ColumnsType<IDataViewProcessApproved> = [
    {
      title: 'STT',
      align: 'left',
      width: 50,
      render(_, __, index) {
        return <Text>{index + 1}</Text>;
      },
    },
    {
      title: 'Người duyệt',
      dataIndex: 'approvedUserName',
      width: 150,
      align: 'left',
      render(value) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Trạng thái duyệt',
      dataIndex: 'status',
      width: 150,
      align: 'left',
      render(value) {
        const saleOrderApprovedStatus = APPROVAL_HISTORY_STEP_STATUS.find(
          (item) => item.value == value
        );
        if (!saleOrderApprovedStatus) return '';
        const text = saleOrderApprovedStatus.label;
        return (
          <Tooltip title={text} placement="topLeft">
            <CTag color={mappingColor[value as keyof typeof mappingColor]}>
              {text}
            </CTag>
          </Tooltip>
        );
      },
    },
    {
      title: 'Ngày duyệt',
      dataIndex: 'approvedDate',
      width: 100,
      align: 'left',
      render(value, record) {
        const saleOrderApprovedStatus = APPROVAL_HISTORY_STEP_STATUS.find(
          (item) => item.value == record.status
        );

        if (!saleOrderApprovedStatus || saleOrderApprovedStatus.value == '1')
          return '';

        const text = value ? dayjs(value, formatDateBe).format(formatDate) : '';
        const tooltip = value
          ? dayjs(value, formatDateBe).format(formatDateTime)
          : '';
        return (
          <Tooltip title={tooltip} placement="topLeft">
            <Text>{text}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Ghi chú',
      dataIndex: 'description',
      width: 200,
      align: 'left',
      render(value, record) {
        const saleOrderApprovedStatus = APPROVAL_HISTORY_STEP_STATUS.find(
          (item) => item.value == record.status
        );
        if (!saleOrderApprovedStatus || saleOrderApprovedStatus.value == '1')
          return '';

        return (
          <Tooltip placement="topLeft" title={value}>
            <Text width="300px">{value}</Text>
          </Tooltip>
        );
      },
    },
  ];

  return (
    <CModal
      title={'Tiến độ phê duyệt'}
      open={open}
      width={1000}
      onCancel={onClose}
      footer={null}
    >
      <Row gutter={[16, 30]}>
        <Col span={24}>
          <StyledCommonTable
            dataSource={dataTable ?? []}
            locale={{
              emptyText: 'Không có dữ liệu',
            }}
            loading={isLoading}
            columns={columnsTableProcessApproved}
            pagination={false}
          />
        </Col>
        <Col span={24}>
          <div className="flex gap-5 items-center justify-end">
            <CButtonClose
              type="default"
              onClick={onClose}
            >
              Đóng
            </CButtonClose>
          </div>
        </Col>
      </Row>
    </CModal>
  );
};

export default memo(ModalViewApprovalProcess);
