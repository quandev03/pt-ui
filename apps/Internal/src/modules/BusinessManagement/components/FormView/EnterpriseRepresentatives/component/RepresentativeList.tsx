import { CButtonAdd, CButtonClose, CButtonDetail } from '@react/commons/Button';
import { CRangePicker } from '@react/commons/DatePicker';
import CFilter, { ItemFilter } from '@react/commons/Filter';
import { CTable, CTag } from '@react/commons/index';
import CInput from '@react/commons/Input';
import CSelect from '@react/commons/Select';
import {
  RowButton,
  RowHeader,
  Text,
  WrapperActionTable,
} from '@react/commons/Template/style';
import { ActionsTypeEnum, ActionType, DateFormat } from '@react/constants/app';
import { formatDate, formatDateTime } from '@react/constants/moment';
import { decodeSearchParams, queryParams } from '@react/helpers/utils';
import useSearchHandler from '@react/hooks/useSearchHandler';
import { Dropdown, Form, Row, Tooltip } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { ColumnsType } from 'antd/es/table';
import { MenuProps } from 'antd/lib';
import { ReactComponent as IconMore } from 'apps/Internal/src/assets/images/IconMore.svg';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import dayjs from 'dayjs';
import { includes } from 'lodash';
import { useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useGetRepresentatives } from '../hooks/useGetRepresentatives';
import { IRepresentativeItem, StatusColor } from '../type';

const RepresentativeList = () => {
  const [form] = useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const actionByRole = useRolesByRouter();
  const [searchParams, setSearchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { data: dataTable, isLoading } = useGetRepresentatives(
    queryParams({
      ...params,
    })
  );
  const { handleSearch } = useSearchHandler(
    REACT_QUERY_KEYS.GET_REPRESENTATIVES
  );
  const idTypeOptions = [
    {
      label: 'CCCD',
      value: '1',
    },
    {
      label: 'CMND',
      value: '2',
    },
  ];
  const statusOptions = [
    {
      label: 'Dừng hoạt động',
      value: 0,
    },
    {
      label: 'Đang hoạt động',
      value: 1,
    },
  ];
  const dateTypeOptions = [
    {
      label: 'Ngày tạo',
      value: '1',
    },
    {
      label: 'Ngày cập nhật',
      value: '2',
    },
  ];
  const openModalEditView = (
    actionType: ActionType,
    record: IRepresentativeItem
  ) => {
    if (actionType === ActionType.VIEW) {
      navigate(pathRoutes.representativeView(record.id + ''));
    } else {
      navigate(pathRoutes.representativeEdit(record.id + ''));
    }
  };
  const columns: ColumnsType<IRepresentativeItem> = [
    {
      title: 'STT',
      align: 'left',
      fixed: 'left',
      width: 50,
      render(_, record, index) {
        return (
          <Text disabled={!record?.status}>
            {index + 1 + params.page * params.size}
          </Text>
        );
      },
    },
    {
      title: 'Họ và tên',
      dataIndex: 'name',
      width: 120,
      align: 'left',
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text disabled={!record?.status}>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Loại GTTT',
      dataIndex: 'idType',
      width: 120,
      align: 'left',
      render(value, record) {
        const renderedValue =
          idTypeOptions.find((item) => item.value === value)?.label || '';
        return (
          <Tooltip title={renderedValue} placement="topLeft">
            <Text disabled={!record?.status}>{renderedValue}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Số GTTT',
      dataIndex: 'idNo',
      width: 120,
      align: 'left',
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text disabled={!record?.status}>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Người tạo',
      dataIndex: 'createdBy',
      width: 150,
      align: 'left',
      render: (value, record) => {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text disabled={!record?.status}>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdDate',

      width: 100,
      align: 'left',
      render: (value, record) => {
        return (
          <Tooltip
            title={dayjs(value).format(formatDateTime)}
            placement="topLeft"
          >
            <Text disabled={!record?.status}>
              {dayjs(value).format(formatDate)}
            </Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Người cập nhật',
      dataIndex: 'modifiedBy',
      width: 150,
      align: 'left',
      render: (value, record) => {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text disabled={!record?.status}>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'modifiedDate',
      width: 130,
      align: 'left',
      render: (value, record) => {
        return (
          <Tooltip
            title={dayjs(value).format(formatDateTime)}
            placement="topLeft"
          >
            <Text disabled={!record?.status}>
              {dayjs(value).format(formatDate)}
            </Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 150,
      align: 'left',
      render: (value, record) => {
        const renderedValue =
          statusOptions.find((item) => item.value === value)?.label || '';
        return (
          <Tooltip title={renderedValue} placement="topLeft">
            <CTag color={StatusColor[value as keyof typeof StatusColor]}>
              {renderedValue}
            </CTag>
          </Tooltip>
        );
      },
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 150,
      fixed: 'right',
      render(_, record) {
        return (
          <WrapperActionTable>
            {includes(actionByRole, ActionsTypeEnum.READ) && (
              <CButtonDetail
                onClick={() => openModalEditView(ActionType.VIEW, record)}
              />
            )}
            <div className="w-5">
              {includes(actionByRole, ActionsTypeEnum.UPDATE) && (
                <Dropdown
                  menu={{ items: renderMenuItemsMore(record) }}
                  placement="bottom"
                  trigger={['click']}
                >
                  <IconMore className="iconMore" />
                </Dropdown>
              )}
            </div>
          </WrapperActionTable>
        );
      },
    },
  ];
  const renderMenuItemsMore = (
    record: IRepresentativeItem
  ): MenuProps['items'] => {
    return [
      {
        key: ActionsTypeEnum.UPDATE,
        label: (
          <Text onClick={() => openModalEditView(ActionType.EDIT, record)}>
            Chỉnh sửa
          </Text>
        ),
      },
    ].filter((item: { key: ActionsTypeEnum; label: JSX.Element }) =>
      includes(actionByRole, item?.key)
    );
  };
  const handleFinish = (values: any) => {
    const { rangePicker, ...rest } = values;
    const [fromDate, toDate] = rangePicker;
    handleSearch(
      {
        ...rest,
        from: fromDate.format(formatDate),
        to: toDate.format(formatDate),
        enterpriseId: id,
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
  const items: ItemFilter[] = [
    {
      label: 'Loại GTTT',
      value: (
        <Form.Item name={'idType'}>
          <CSelect
            placeholder="Loại GTTT"
            options={idTypeOptions}
            showSearch={false}
          />
        </Form.Item>
      ),
    },
    {
      label: 'Trạng thái',
      value: (
        <Form.Item name={'status'} className="w-40">
          <CSelect
            placeholder="Trạng thái"
            options={statusOptions}
            showSearch={false}
          />
        </Form.Item>
      ),
    },
    {
      label: 'Loại ngày',
      value: (
        <>
          <Form.Item name={'dateType'} className="w-36">
            <CSelect
              placeholder="Loại ngày"
              options={dateTypeOptions}
              allowClear={false}
              showSearch={false}
            />
          </Form.Item>
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
        </>
      ),
      showDefault: true,
    },
  ];
  useEffect(() => {
    if (params.tab === 'nuq' && !params.from) {
      setSearchParams({
        tab: 'nuq',
        from: dayjs().subtract(29, 'day').format(formatDate),
        to: dayjs().format(formatDate),
        dateType: '1',
        filters: '2',
        enterpriseId: id + '',
      });
    }
  }, [params.from, params.tab]);
  useEffect(() => {
    if (params) {
      const { from, to, ...rest } = params;
      const rangePicker = [dayjs(from, formatDate), dayjs(to, formatDate)];
      form.setFieldsValue({
        rangePicker: rangePicker,
        ...rest,
      });
    }
  }, [params]);
  const handleRefresh = () => {
    form.resetFields();
    setSearchParams(
      {
        tab: 'nuq',
        filters: '2',
        dateType: '1',
        queryTime: dayjs().format(DateFormat.TIME),
        enterpriseId: id + '',
      },
      { replace: true }
    );
  };
  return (
    <>
      <RowHeader className="pl-[6px]">
        <Form form={form} colon={false} onFinish={handleFinish}>
          <Row gutter={[8, 16]}>
            <CFilter
              onRefresh={handleRefresh}
              searchComponent={
                <Tooltip title="Nhập Họ và tên/ Số GTTT/ Người tạo/ Người cập nhật">
                  <Form.Item name={'param'} label={''}>
                    <CInput
                      placeholder="Nhập điều kiện tìm kiếm"
                      maxLength={100}
                    />
                  </Form.Item>
                </Tooltip>
              }
              items={items}
              validQuery={REACT_QUERY_KEYS.GET_REPRESENTATIVES}
            />
          </Row>
        </Form>
        {includes(actionByRole, ActionsTypeEnum.CREATE) && (
          <RowButton>
            <CButtonAdd
              onClick={() => navigate(pathRoutes.representativeAdd(id))}
            />
          </RowButton>
        )}
      </RowHeader>
      <CTable
        columns={columns}
        dataSource={dataTable?.content || []}
        loading={isLoading}
        pagination={{
          current: params.page + 1,
          pageSize: params.size,
          total: dataTable?.totalElements || 0,
        }}
      />
      <Row justify="end" className={dataTable?.totalElements ? '' : 'mt-5'}>
        <CButtonClose onClick={() => navigate(-3)} />
      </Row>
    </>
  );
};
export default RepresentativeList;
