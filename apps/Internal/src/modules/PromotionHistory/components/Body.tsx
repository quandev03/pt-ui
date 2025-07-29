import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CButton, { CButtonDetail } from '@react/commons/Button';
import { CRangePicker } from '@react/commons/DatePicker';
import CFilter, { ItemFilter } from '@react/commons/Filter';
import CInput from '@react/commons/Input';
import CSelect from '@react/commons/Select';
import CTable from '@react/commons/Table';
import { ExtendedColumnsType } from '@react/commons/TableSearch';
import CTag from '@react/commons/Tag';
import {
  BtnGroupFooter,
  RowHeader,
  Text,
  TitleHeader,
  WrapperActionTable,
} from '@react/commons/Template/style';
import { TotalTableMessage } from '@react/commons/Template/TotalTableMessage';
import { AnyElement } from '@react/commons/types';
import { ActionsTypeEnum, ActionType } from '@react/constants/app';
import { ColorList } from '@react/constants/color';
import {
  formatDate,
  formatDateTime,
  formatDateV2,
} from '@react/constants/moment';
import { decodeSearchParams } from '@react/helpers/utils';
import useSearchHandler from '@react/hooks/useSearchHandler';
import { Col, Dropdown, Form, MenuProps, Row, Tooltip } from 'antd';
import { ReactComponent as IconMore } from 'apps/Internal/src/assets/images/IconMore.svg';
import ModalConfirm from 'apps/Internal/src/components/modalConfirm';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCancel } from '../queryHook/useCancel';
import { useGetFileDownloadFn } from '../queryHook/useGetFileDownload';
import { useList } from '../queryHook/useList';
import { usePending } from '../queryHook/usePause';
import { useRunning } from '../queryHook/useRun';
import { ContentItem, StatusType, StatusTypeEnum } from '../types';

const Body = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { isLoading: loadingTable, data: dataTable } = useList(params);
  const { handleSearch } = useSearchHandler(
    REACT_QUERY_KEYS.GET_LIST_PROMOTION_HISTORY
  );
  const intl = useIntl();
  const [form] = Form.useForm();
  const { mutate: getFileDownload } = useGetFileDownloadFn();
  const handleDownload = (url: string) => {
    getFileDownload(url);
  };
  const { mutate: cancelMutate } = useCancel(form, () => {
    console.log('DONE CANCEL');
  });
  const { mutate: pendingMutate } = usePending(form, () => {
    console.log('DONE CANCEL');
  });
  const { mutate: runningMutate } = useRunning(form, () => {
    console.log('DONE CANCEL');
  });
  const handleCancel = (id: string) => {
    ModalConfirm({
      message: 'Bạn có chắc chắn muốn hủy chương trình khuyến mại?',
      handleConfirm() {
        cancelMutate(id);
      },
    });
  };

  const handlePending = (id: string) => {
    ModalConfirm({
      message: 'Bạn có chắc chắn muốn tạm dừng chương trình khuyến mại?',
      handleConfirm() {
        pendingMutate(id);
      },
    });
  };
  const handleRunning = (id: string) => {
    ModalConfirm({
      message: 'Bạn có chắc chắn muốn chạy chương trình khuyến mại?',
      handleConfirm() {
        runningMutate(id);
      },
    });
  };

  const reasonTypeOptions = [
    {
      label: 'Ngày tạo',
      value: '1',
    },
    {
      label: 'Thời gian chạy',
      value: '2',
    },
  ];

  const statusOptions = [
    {
      label: 'Chưa chạy',
      value: 0,
    },
    {
      label: 'Đang chạy',
      value: 1,
    },
    {
      label: 'Đã chạy',
      value: 2,
    },
    {
      label: 'Tạm dừng',
      value: 3,
    },
    {
      label: 'Đã hủy',
      value: 4,
    },
  ];

  useEffect(() => {
    form.submit();
  }, [params.type]);

  useEffect(() => {
    if (params) {
      const { fromDate, toDate, number, status, type, ...rest } = params;
      const from = fromDate
        ? dayjs(fromDate, formatDate)
        : dayjs().subtract(29, 'day');
      const to = toDate ? dayjs(toDate, formatDate) : dayjs();
      form.setFieldsValue({
        ...rest,
        type: type ?? '1',
        rangePicker: [from, to],
      });
    }
  }, [params]);

  const items: ItemFilter[] = [
    {
      label: 'Trạng thái',
      value: (
        <Form.Item name={'status'} className="w-48">
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
          <Form.Item name={'type'} className="w-48">
            <CSelect
              options={reasonTypeOptions}
              placeholder="Loại ngày"
              allowClear={false}
              showSearch={false}
            />
          </Form.Item>
          <Form.Item name={'rangePicker'}>
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

  const renderMenuItemsMore = (record: ContentItem): MenuProps['items'] => {
    let arr: AnyElement[] = [];
    if (record.status === StatusTypeEnum.NOT_RUN) {
      arr = [
        {
          key: ActionsTypeEnum.UPDATE,
          label: (
            <Text onClick={() => openModalEditView(ActionType.EDIT, record)}>
              <FormattedMessage id={'common.edit'} />
            </Text>
          ),
        },
        {
          key: ActionsTypeEnum.PENDING,
          label: (
            <Text
              // type="danger"
              onClick={() => {
                handlePending(record.id);
              }}
            >
              Tạm dừng
            </Text>
          ),
        },
        {
          key: ActionsTypeEnum.RUNNING,
          label: (
            <Text
              // type="danger"
              onClick={() => {
                handleRunning(record.id);
              }}
            >
              Chạy CTKM
            </Text>
          ),
        },
        {
          key: ActionsTypeEnum.CANCEL,
          label: (
            <Text
              type="danger"
              onClick={() => {
                handleCancel(record.id);
              }}
            >
              Hủy
            </Text>
          ),
        },
      ];
    } else if (record.status === StatusTypeEnum.RUNNING) {
      arr = [
        {
          key: ActionsTypeEnum.PENDING,
          label: (
            <Text
              // type="danger"
              onClick={() => handlePending(record.id)}
            >
              Tạm dừng
            </Text>
          ),
        },
        {
          key: ActionsTypeEnum.CANCEL,
          label: (
            <Text type="danger" onClick={() => handleCancel(record.id)}>
              Hủy
            </Text>
          ),
        },
      ];
    } else if (
      record.status === StatusTypeEnum.PAUSED ||
      record.status === StatusTypeEnum.PAUSED2
    ) {
      arr = [
        {
          key: ActionsTypeEnum.RUNNING,
          label: (
            <Text
              // type="danger"
              onClick={() => handleRunning(record.id)}
            >
              Chạy CTKM
            </Text>
          ),
        },
        {
          key: ActionsTypeEnum.CANCEL,
          label: (
            <Text type="danger" onClick={() => handleCancel(record.id)}>
              Hủy
            </Text>
          ),
        },
      ];
    }
    return arr;
    // .filter((item: { key: ActionsTypeEnum; label: JSX.Element }) =>
    //   includes(actionByRole, item?.key)
    // );
  };

  const handleAdd = () => {
    navigate(pathRoutes.promotionHistoryAdd);
  };

  const columns: ExtendedColumnsType<ContentItem> = [
    {
      title: 'STT',
      align: 'left',
      fixed: 'left',
      width: 50,
      render(_, record, index) {
        return <Text>{index + 1 + params.page * params.size}</Text>;
      },
    },
    {
      title: 'Mã CTKM',
      dataIndex: 'promotionCode',
      width: 120,
      align: 'left',
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Tên CTKM',
      dataIndex: 'promotionName',
      width: 120,
      align: 'left',
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Người tạo',
      dataIndex: 'createdBy',
      width: 120,
      align: 'left',
      render: (value, record) => {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
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
            <Text>{dayjs(value).format(formatDate)}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Người cập nhật',
      dataIndex: 'modifiedBy',
      width: 120,
      align: 'left',
      render: (value, record) => {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'modifiedDate',
      width: 120,
      align: 'left',
      render: (value, record) => {
        return (
          <Tooltip
            title={dayjs(value).format(formatDateTime)}
            placement="topLeft"
          >
            <Text>{dayjs(value).format(formatDate)}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Thời gian chạy',
      dataIndex: 'processingStartDate',
      width: 120,
      align: 'left',
      render: (value) => {
        return (
          <Tooltip
            title={value ? dayjs(value).format(formatDateTime) : ''}
            placement="topLeft"
          >
            <Text>{value ? dayjs(value).format(formatDate) : ''}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'role.statusName' }),
      dataIndex: 'status',
      width: 120,
      align: 'left',
      render: (value: StatusTypeEnum) => {
        return (
          <Tooltip title={StatusType[value]} placement="top">
            <CTag
              color={
                value === StatusTypeEnum.NOT_RUN
                  ? ColorList.WAITING
                  : value === StatusTypeEnum.RUNNING
                  ? ColorList.PROCESSING
                  : value === StatusTypeEnum.RAN
                  ? ColorList.SUCCESS
                  : value === StatusTypeEnum.PAUSED ||
                    value === StatusTypeEnum.PAUSED2 ||
                    value === StatusTypeEnum.CANCELLED ||
                    value === StatusTypeEnum.CANCELLED2 ||
                    value === StatusTypeEnum.CANCELLED3
                  ? ColorList.FAIL
                  : ColorList.DEFAULT
              }
            >
              {StatusType[value as keyof typeof StatusType]}
            </CTag>
          </Tooltip>
        );
      },
    },
    {
      title: 'Kết quả',
      dataIndex: 'modifiedDate',
      width: 200,
      align: 'left',
      render: (value, record) => {
        if (
          record.status === StatusTypeEnum.RUNNING ||
          record.status === StatusTypeEnum.RAN ||
          record.status === StatusTypeEnum.PAUSED ||
          record.status === StatusTypeEnum.PAUSED2 ||
          record.status === StatusTypeEnum.CANCELLED2 ||
          record.status === StatusTypeEnum.CANCELLED3
        )
          return (
            <div>
              <div>{`Số lượng thành công: ${
                record.successfulRecords || record.successfulRecords === 0
                  ? record.successfulRecords
                  : ''
              }`}</div>
              <div>{`Số lượng thất bại: ${
                record.failedRecords || record.failedRecords === 0
                  ? record.failedRecords
                  : ''
              }`}</div>
              <div>
                {`File kết quả: `}
                {record.status !== StatusTypeEnum.RUNNING && (
                  <span
                    className="text-primary underline cursor-pointer"
                    onClick={() => handleDownload(record.resultFilePath)}
                  >
                    File
                  </span>
                )}
              </div>
            </div>
          );
      },
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      width: 100,
      align: 'left',
      render: (value, record) => {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'common.action' }),
      align: 'center',
      width: 150,
      fixed: 'right',
      render(_, record) {
        return (
          <WrapperActionTable>
            {/* {includes(actionByRole, ActionsTypeEnum.READ) && ( */}
            <CButtonDetail
              onClick={() => openModalEditView(ActionType.VIEW, record)}
            />
            {/* )} */}
            {/* {(includes(actionByRole, ActionsTypeEnum.UPDATE) ||
              includes(actionByRole, ActionsTypeEnum.DELETE)) && ( */}
            <Dropdown
              menu={{ items: renderMenuItemsMore(record) }}
              placement="bottom"
              trigger={['click']}
            >
              <IconMore className="iconMore" />
            </Dropdown>
            {/* )} */}
          </WrapperActionTable>
        );
      },
    },
  ];

  const openModalEditView = (type: ActionType, record: ContentItem) => {
    return navigate(
      type === ActionType.EDIT
        ? pathRoutes.promotionHistoryEdit(record.id)
        : pathRoutes.promotionHistoryView(record.id)
    );
  };
  const handleFinish = (values: AnyElement) => {
    const { rangePicker, ...rest } = values;
    const [fromDate, toDate] = rangePicker || [
      dayjs().subtract(29, 'day').startOf('day'),
      dayjs().endOf('day'),
    ];
    const filters = params.filters ?? '1';
    setSearchParams({
      ...params,
      ...rest,
      filters,
      fromDate: fromDate.format(formatDateV2),
      toDate: toDate.format(formatDateV2),
      page: 0,
    });
    handleSearch(params);
  };

  return (
    <div>
      <div>
        <TitleHeader>Lịch sử chạy CTKM</TitleHeader>
        <RowHeader>
          <Form
            form={form}
            // initialValues={{ param: '', reasonTypeId: 0 }}
            onFinish={handleFinish}
          >
            <Row gutter={8}>
              <Col>
                <CFilter
                  searchComponent={
                    <Tooltip title={'Nhập mã CTKM/ tên CTKM/ người tạo'}>
                      <Form.Item label="" name="valueSearch">
                        <CInput
                          placeholder="Nhập mã CTKM/ tên CTKM/ người tạo"
                          prefix={<FontAwesomeIcon icon={faSearch} />}
                          maxLength={50}
                        />
                      </Form.Item>
                    </Tooltip>
                  }
                  items={items}
                />
              </Col>
              <BtnGroupFooter>
                <CButton
                  icon={<FontAwesomeIcon icon={faPlus} />}
                  onClick={handleAdd}
                >
                  <FormattedMessage id="common.add" />
                </CButton>
              </BtnGroupFooter>
            </Row>
          </Form>
        </RowHeader>
      </div>
      <CTable
        rowKey="id"
        // expandable={{ defaultExpandAllRows: true }}
        loading={loadingTable}
        columns={columns}
        dataSource={dataTable?.content}
        pagination={{
          current: params.page + 1,
          pageSize: params.size,
          total: dataTable?.totalElements,
          showQuickJumper: true,
          showTotal: TotalTableMessage,
          locale: {
            jump_to: intl.formatMessage({ id: 'common.jump_to' }),
            page: '',
          },
        }}
        // onChange={handleChangeTable}
      />
    </div>
  );
};

export default Body;
