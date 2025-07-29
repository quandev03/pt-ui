import {
  faAnglesDown,
  faAnglesUp,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CButton, { CButtonDetail } from '@react/commons/Button';
import { CTable } from '@react/commons/index';
import { ActionsTypeEnum, DateFormat } from '@react/constants/app';
import { getDate } from '@react/utils/datetime';
import { Card, Collapse, Form, Space, TableProps, Tooltip } from 'antd';
import { useState } from 'react';
import { useFeedbackHistoryQuery } from '../hooks/useFeedbackHistoryQuery';
import {
  FeedbackHistory as FeedbackHistoryType,
  FeedbackHistoryRequest,
} from '../types';
import { useGetApplicationConfig } from 'apps/Internal/src/hooks/useGetApplicationConfig';
import dayjs from 'dayjs';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { Link } from 'react-router-dom';
import {
  FeedbackPriorityList,
  getPriorityStyles,
} from '../../Feedback/constants';
import { Text } from '@react/commons/Template/style';

const FeedbackHistory: React.FC = () => {
  const form = Form.useFormInstance();
  const isdn = Form.useWatch('isdn', form);
  const actions = useRolesByRouter(pathRoutes.feedbackCSKH);
  const [activeKey, setActiveKey] = useState(0);
  const [params, setParams] = useState<FeedbackHistoryRequest>({
    page: 0,
    size: 5,
  });
  const { isFetching, data } = useFeedbackHistoryQuery({ ...params, isdn });
  const { data: feedbackStatusData } = useGetApplicationConfig(
    'FEEDBACK_REQUEST_STATUS'
  );

  const columns: TableProps<FeedbackHistoryType>['columns'] = [
    {
      title: 'ID',
      align: 'center',
      dataIndex: 'id',
      fixed: 'left',
      width: 60,
      render: (value) => (
        <Tooltip title={value} placement="topLeft">
          {value}
        </Tooltip>
      ),
    },
    {
      title: 'Tên phản ánh',
      dataIndex: 'feedbackName',
      width: 180,
      render: (value) => (
        <Tooltip title={value} placement="topLeft">
          {value}
        </Tooltip>
      ),
    },
    {
      title: 'Loại phản ánh',
      dataIndex: 'feedbackType',
      width: 180,
      render: (value) => (
        <Tooltip title={value} placement="topLeft">
          {value}
        </Tooltip>
      ),
    },
    {
      title: 'Trạng thái xử lý',
      dataIndex: 'status',
      width: 140,
      render: (value) =>
        feedbackStatusData?.find((item) => item.code === value)?.name,
    },
    {
      title: 'Thời hạn phản ánh',
      dataIndex: 'deadline',
      width: 160,
      render: (value) => getDate(value, DateFormat.DATE_TIME),
    },
    {
      title: 'Nội dung phản ánh',
      dataIndex: 'content',
      width: 180,
      render: (value) => (
        <Tooltip title={value} placement="topLeft">
          {value}
        </Tooltip>
      ),
    },
    {
      title: 'Ngày phản ánh',
      dataIndex: 'createdDate',
      width: 160,
      render: (value) => getDate(value, DateFormat.DATE_TIME),
    },
    {
      title: 'Người tạo',
      dataIndex: 'createdBy',
      width: 170,
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            {value}
          </Tooltip>
        );
      },
    },

    {
      title: 'BO duyệt',
      dataIndex: 'approvalDepartment',
      width: 160,
      render: (value) => (
        <Tooltip title={value} placement="topLeft">
          {value}
        </Tooltip>
      ),
    },
    {
      title: 'Phòng ban xử lý',
      dataIndex: 'department',
      width: 160,
      render: (value) => (
        <Tooltip title={value} placement="topLeft">
          {value}
        </Tooltip>
      ),
    },
    {
      title: 'Người xử lý',
      dataIndex: 'processor',
      width: 160,
      render: (value) => (
        <Tooltip title={value} placement="topLeft">
          {value}
        </Tooltip>
      ),
    },

    {
      title: 'Số lần phản ánh',
      dataIndex: 'feedbackCount',
      width: 130,
      render(value) {
        return (
          <Tooltip title={value} placement="topLeft">
            {value}
          </Tooltip>
        );
      },
    },
    {
      title: 'Độ ưu tiên',
      dataIndex: 'priorityLevel',
      width: 100,
      fixed: 'right',
      render(value, record) {
        const priorityName = FeedbackPriorityList.find(
          (e) => e.value === value
        )?.label;
        return (
          <Tooltip title={priorityName} placement="topLeft">
            <Text
              style={{
                ...getPriorityStyles(record?.priorityLevel as any),
              }}
            >
              {priorityName}
            </Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Thao tác',
      align: 'center',
      fixed: 'right',
      width: 120,
      hidden: !actions.includes(ActionsTypeEnum.READ),
      render: ({ id }) => (
        <Link to={pathRoutes.feedbackRouteView(pathRoutes.feedbackCSKH, id)}>
          <CButtonDetail />
        </Link>
      ),
    },
  ];

  return (
    <Card>
      <Collapse
        ghost
        activeKey={activeKey}
        collapsible="icon"
        items={[
          {
            key: 1,
            showArrow: false,
            styles: {
              header: { padding: 0 },
              body: { padding: 0, paddingTop: 20 },
            },
            extra: actions.includes(ActionsTypeEnum.CREATE) && (
              <Link
                to={pathRoutes.feedbackRouteAdd(pathRoutes.feedbackCSKH)}
                state={{ isdn }}
              >
                <CButton icon={<FontAwesomeIcon icon={faPlus} />}>
                  Thêm mới
                </CButton>
              </Link>
            ),
            label: (
              <Space>
                <legend>Lịch sử phản ánh</legend>
                <CButton
                  type="text"
                  icon={
                    <FontAwesomeIcon
                      className="cursor-pointer"
                      icon={activeKey ? faAnglesUp : faAnglesDown}
                    />
                  }
                  onClick={() => setActiveKey(activeKey ? 0 : 1)}
                />
              </Space>
            ),
            children: (
              <CTable
                rowKey="id"
                columns={columns}
                dataSource={data?.content}
                loading={isFetching}
                scroll={{ y: 250 }}
                rowClassName={(record) =>
                  record?.warning ? 'text-red-500' : ''
                }
                pagination={{
                  current: params.page + 1,
                  pageSize: params.size,
                  total: data?.totalElements,
                  onChange: (page, pageSize) =>
                    setParams({ ...params, page: page - 1, size: pageSize }),
                }}
              />
            ),
          },
        ]}
      />
    </Card>
  );
};

export default FeedbackHistory;
