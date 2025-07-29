import { CButtonClose, CButtonDetail } from '@react/commons/Button';
import { CRangePicker } from '@react/commons/DatePicker';
import CFilter, { ItemFilter } from '@react/commons/Filter';
import CInput from '@react/commons/Input';
import {
  RowHeader,
  Text,
  TitleHeader,
  Wrapper,
  WrapperActionTable,
} from '@react/commons/Template/style';
import { ActionsTypeEnum } from '@react/constants/app';
import {
  formatDate,
  formatDateBe,
  formatDateTime,
} from '@react/constants/moment';
import { decodeSearchParams, queryParams } from '@react/helpers/utils';
import useSearchHandler from '@react/hooks/useSearchHandler';
import { Form, Row, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import dayjs from 'dayjs';
import { includes } from 'lodash';
import React, { useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useGetEnterpriseHistoryList } from '../../hooks/useGetEnterpriseHistory';
import { StyledTable } from '../../page/styles';
import { IEnterpriseHistoryItem } from './types';

const EnterpriseHistory: React.FC = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const actionByRole = useRolesByRouter();
  const navigate = useNavigate();
  const { handleSearch } = useSearchHandler(
    REACT_QUERY_KEYS.GET_ENTERPRISE_HISTORY_LIST
  );
  const startDate = dayjs(params.startTime, formatDateBe).isValid()
    ? dayjs(params.startTime, formatDateBe)
    : dayjs(params.startTime, formatDate);
  const endDate = dayjs(params.endTime, formatDateBe).isValid()
    ? dayjs(params.endTime, formatDateBe)
    : dayjs(params.endTime, formatDate);
  const { data: enterpriseHistoryData } = useGetEnterpriseHistoryList(
    queryParams({
      ...params,
      startTime: startDate.format(formatDateBe),
      endTime: endDate.endOf('day').format(formatDateBe),
      idRecord: id,
    })
  );
  const handleFinish = (values: any) => {
    const { rangePicker, ...rest } = values;
    const [startDate, endDate] = rangePicker;
    handleSearch(
      {
        ...rest,
        startTime: startDate.format(formatDateBe),
        endTime: endDate.format(formatDateBe),
        idRecord: id,
      },
      { replace: true }
    );
  };
  const validateDateRange = () => {
    const [start, end] = form.getFieldValue('rangePicker');
    const diffInDays = end.diff(start, 'days');
    if (diffInDays > 30) {
      return Promise.reject(
        new Error('Thời gian tìm kiếm không được vượt quá 30 ngày')
      );
    }
    return Promise.resolve();
  };
  useEffect(() => {
    if (!params.startTime) {
      setSearchParams({
        ...params,
        startTime: dayjs().subtract(29, 'day').format(formatDate),
        endTime: dayjs().format(formatDate),
        actionType: 'UPDATE',
        targetType: 'ENTERPRISE',
        idRecord: id,
        filters: '0',
      });
    }
  }, [params.startTime]);
  useEffect(() => {
    if (params) {
      const { startTime, endTime, ...rest } = params;
      const rangePicker = dayjs(startTime, formatDate).isValid()
        ? [dayjs(startTime, formatDate), dayjs(endTime, formatDate)]
        : [dayjs(startTime, formatDateBe), dayjs(endTime, formatDateBe)];
      form.setFieldsValue({
        rangePicker: rangePicker,
        rest,
      });
    }
  }, [params]);
  const items: ItemFilter[] = [
    {
      label: 'Ngày thực hiện',
      value: (
        <Form.Item
          name={'rangePicker'}
          rules={[{ validator: validateDateRange }]}
        >
          <CRangePicker
            placeholder={['Từ ngày', 'Đến ngày']}
            format={formatDate}
            allowClear={false}
          />
        </Form.Item>
      ),
      showDefault: true,
    },
  ];
  const columns: ColumnsType<IEnterpriseHistoryItem> = [
    {
      title: 'STT',
      align: 'left',
      fixed: 'left',
      width: 20,
      render(_, __, index) {
        return <Text>{index + 1 + params.page * params.size}</Text>;
      },
    },
    {
      title: 'User thực hiện',
      dataIndex: 'username',
      width: 120,
      align: 'left',
      render(value, record) {
        return (
          <Tooltip title={record.username} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Ngày thực hiện',
      dataIndex: 'actionTime',
      width: 100,
      align: 'left',
      render: (value, record) => {
        return (
          <Tooltip
            title={dayjs(value).format(formatDateTime)}
            placement="topLeft"
          >
            <Text>{dayjs(value).format(formatDateTime)}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 30,
      fixed: 'right',
      render(_, record) {
        return (
          <WrapperActionTable>
            {includes(actionByRole, ActionsTypeEnum.READ) && (
              <CButtonDetail
                onClick={() =>
                  navigate(pathRoutes.enterpriseHistoryDetail(record.id))
                }
              />
            )}
          </WrapperActionTable>
        );
      },
    },
  ];
  const handleRefresh = () => {
    handleSearch(
      {
        ...params,
        startTime: dayjs().subtract(29, 'day').format(formatDate),
        endTime: dayjs().format(formatDate),
        actionType: 'UPDATE',
        targetType: 'ENTERPRISE',
        username: '',
        filters: '0',
      },
      { replace: true }
    );
    form.setFieldValue('username', '');
  };
  return (
    <Wrapper>
      <TitleHeader>Lịch sử chỉnh sửa doanh nghiệp</TitleHeader>
      <RowHeader>
        <Form form={form} colon={false} onFinish={handleFinish}>
          <Row gutter={[8, 16]}>
            <CFilter
              searchComponent={
                <Form.Item name={'username'} label={''}>
                  <CInput placeholder="Nhập user thực hiện" maxLength={100} />
                </Form.Item>
              }
              items={items}
              validQuery={REACT_QUERY_KEYS.GET_ENTERPRISE_HISTORY_LIST}
              onRefresh={handleRefresh}
            />
          </Row>
        </Form>
      </RowHeader>
      <StyledTable
        columns={columns}
        dataSource={enterpriseHistoryData?.content || []}
        pagination={{
          current: params.page + 1,
          pageSize: params.size,
          total: enterpriseHistoryData?.totalElements || 0,
        }}
      />
      <Row
        justify="end"
        className={enterpriseHistoryData?.totalElements ? '' : 'mt-5'}
      >
        <CButtonClose onClick={() => navigate(-3)} />
      </Row>
    </Wrapper>
  );
};
export default EnterpriseHistory;
