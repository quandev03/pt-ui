import {
  CButtonClose,
  CButtonDetail,
  CButtonExport,
} from '@react/commons/Button';
import {
  RowHeader,
  Text,
  TitleHeader,
  WrapperActionTable,
  WrapperButton,
} from '@react/commons/Template/style';
import { ActionsTypeEnum, ActionType } from '@react/constants/app';
import type { MenuProps, TablePaginationConfig } from 'antd';
import { Col, Form, Row, Space, Tooltip, Select, Dropdown, Button } from 'antd';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useList } from '../queryHook/useList';
import { ContentItem } from '../types';
import { Key, useCallback, useEffect, useMemo, useState } from 'react';
import CButton from '@react/commons/Button';
import CInput from '@react/commons/Input';
import CTableSearch, { ExtendedColumnsType } from '@react/commons/TableSearch';
import CTag from '@react/commons/Tag';
import { decodeSearchParams, queryParams } from '@react/helpers/utils';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import CFilter, { ItemFilter } from '@react/commons/Filter';
import CSelect from '@react/commons/Select';
import { StyledButton } from '../../ActivationAssignedList/page/style';
import { CRangePicker } from '@react/commons/DatePicker';
import { formatDate, formatDateTime } from '@react/constants/moment';
import RejectModal from './RejectModal';
import AcceptModal from './AcceptModal';
import { useListApproveStatus } from '../../ActivationRequestList/queryHook/useList';
import dayjs from 'dayjs';
import CInputNumber from '@react/commons/InputNumber';
import { ReactComponent as IconMore } from 'apps/Internal/src/assets/images/IconMore.svg';
import { useExportList } from '../queryHook/useExport';
import CModal from '@react/commons/Modal';
import useSearchHandler from '@react/hooks/useSearchHandler';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import {
  ActiveStatus,
  ApproveStatus,
  idType,
} from '../../ActivationRequestList/types';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import { includes } from 'lodash';
import { ColorList } from '@react/constants/color';
import { useActivationApprovedStore } from '../store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCancel, faCheck, faPlane } from '@fortawesome/free-solid-svg-icons';

const Body: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [form] = Form.useForm();
  const [formDocument] = Form.useForm();
  const [formSelect] = Form.useForm();
  const recordFrom = Form.useWatch('recordFrom', formSelect);
  const recordTo = Form.useWatch('recordTo', formSelect);
  const [disableSelectBtn, setDisableSelectBtn] = useState(true);
  const [isPassSensor, setIsPassSensor] = useState(false);
  const [isOpenSensorModal, setIsOpenSensorModal] = useState(false);
  const intl = useIntl();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenProcess, setIsOpenProcess] = useState(false);
  const listRoleByRouter = useRolesByRouter();
  const params = decodeSearchParams(searchParams);
  const [paramsTab, setParamsTab] = useState({ page: 0, size: 20 });
  const { handleSearch } = useSearchHandler(
    REACT_QUERY_KEYS.GET_LIST_OF_ACTIVE_APPROVE_LIST
  );
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const { data: dataApproveStatus } = useListApproveStatus();
  const approveStatusOptions = dataApproveStatus
    ?.filter((item: any) => item.code === '0' || item.code === '3')
    .map((status: any) => ({
      label: status.value,
      value: parseInt(status.code),
    }));
  const onSelectChange = useCallback((newSelectedRowKeys: Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  }, []);

  const rowSelection = useMemo(
    () => ({
      selectedRowKeys,
      onChange: onSelectChange,
      getCheckboxProps: (record: ContentItem) => ({
        disabled: record.approveStatus === 2 || record.approveStatus === 1,
      }),
    }),
    [onSelectChange, selectedRowKeys]
  );

  const { setClickSearch, clickSearch } = useActivationApprovedStore();

  useEffect(() => {
    if (clickSearch === true) {
      setSelectedRowKeys([]);
      formSelect.resetFields();
    }
  }, [clickSearch]);

  useEffect(() => {
    if (recordFrom && recordTo) {
      setDisableSelectBtn(false);
    } else {
      setDisableSelectBtn(true);
    }
    if (recordFrom === 0) {
      formSelect.setFields([
        {
          name: 'recordFrom',
          errors: ['Dữ liệu không hợp lệ'],
        },
        {
          name: 'recordTo',
          errors: ['s'],
        },
      ]);
    } else {
      formSelect.setFields([
        {
          name: 'recordFrom',
          errors: [],
        },
      ]);
    }
    if (recordTo === 0) {
      formSelect.setFields([
        {
          name: 'recordTo',
          errors: ['Dữ liệu không hợp lệ'],
        },
      ]);
    } else {
      formSelect.setFields([
        {
          name: 'recordTo',
          errors: [],
        },
      ]);
    }
  }, [recordFrom, recordTo]);

  const handleFinishSelect = () => {
    if (recordFrom > recordTo) {
      formSelect.setFields([
        {
          name: 'recordFrom',
          errors: ['Dữ liệu không hợp lệ'],
        },
      ]);
      return;
    } else {
      setClickSearch(false);
      formSelect.setFields([
        {
          name: 'recordFrom',
          errors: [],
        },
      ]);
    }

    const selectedKeys = dataTable?.content
      .slice(recordFrom - 1, recordTo)
      .map((item: any) => item.id);

    setSelectedRowKeys(selectedKeys);
  };

  const { isLoading: loadingTable, data: dataTable } = useList(
    queryParams(params)
  );

  const [heightTable, setHeightTable] = useState(0);
  const { mutateAsync: mutateExport } = useExportList();
  const onDownload = () => {
    mutateExport(params);
  };

  useEffect(() => {
    const id = setTimeout(changeHeightTable, 500);
    return () => {
      clearTimeout(id);
    };
  }, []);

  useEffect(() => {
    form.submit();
  }, [params.type]);

  useEffect(() => {
    if (params) {
      const { fromDate, toDate, number, status, ...rest } = params;
      const from = fromDate
        ? dayjs(fromDate, formatDate)
        : dayjs().subtract(29, 'day');
      const to = toDate ? dayjs(toDate, formatDate) : dayjs();
      const stt = status !== '' ? status : undefined;
      form.setFieldsValue({
        ...rest,
        status: stt,
        rangePicker: [from, to],
      });
    }
  }, [params]);

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
      label: 'Trạng thái tiền kiểm',
      value: (
        <Form.Item name={'status'} className="w-48">
          <CSelect
            placeholder="Trạng thái tiền kiểm"
            options={approveStatusOptions}
            showSearch={false}
          />
        </Form.Item>
      ),
    },
    {
      label: 'Loại ngày',
      value: (
        <>
          <Form.Item name={'type'}>
            <Select
              placeholder="Loại ngày"
              options={[
                {
                  label: 'Ngày tạo yêu cầu',
                  value: '1',
                },
              ]}
              allowClear={false}
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

  const reasonOptions = [
    {
      label: 'Hồ sơ đi vào Kiểm duyệt',
      value: 0,
    },
    {
      label: 'Hồ sơ đi vào Hậu kiểm',
      value: 1,
    },
  ];

  const renderMenuItemsMore = (record: ContentItem): MenuProps['items'] => {
    const extendedMenu = [];
    if (includes(listRoleByRouter, ActionsTypeEnum.APPROVED)) {
      extendedMenu.push({
        key: ActionsTypeEnum.APPROVED,
        label: (
          <Text
            onClick={() => {
              setSelectedRowKeys([record.id]);
              setIsOpenSensorModal(true);
            }}
          >
            {<FormattedMessage id={'Phê duyệt'} />}
          </Text>
        ),
      });
    }
    if (includes(listRoleByRouter, ActionsTypeEnum.REJECT)) {
      extendedMenu.push({
        key: ActionsTypeEnum.REJECT,
        label: (
          <Text
            onClick={() => {
              setSelectedRowKeys([record.id]);
              setIsOpenModal(true);
            }}
          >
            {<FormattedMessage id={'Từ chối'} />}
          </Text>
        ),
      });
    }

    return extendedMenu;
  };

  const handleChangeTable = useCallback(
    (pagination: TablePaginationConfig) => {
      setParamsTab({
        ...paramsTab,
        page: (pagination.current as number) - 1,
        size: pagination.pageSize as number,
      });
    },
    [paramsTab]
  );

  const columns: ExtendedColumnsType<ContentItem> = [
    {
      title: 'STT',
      align: 'left',
      width: 60,
      fixed: 'left',
      searchDisiable: true,
      render(_, record, index) {
        const stt = index + 1 + paramsTab.page * paramsTab.size;
        return <Text>{stt}</Text>;
      },
    },
    {
      title: 'Nhân viên phát triển',
      dataIndex: 'empCode',
      width: 180,
      align: 'left',
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            {value}
          </Tooltip>
        );
      },
    },
    {
      title: 'Số hợp đồng',
      dataIndex: 'contractNo',
      width: 150,
      align: 'left',
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            {value}
          </Tooltip>
        );
      },
    },
    {
      title: 'Ngày tạo yêu cầu',
      dataIndex: 'requestDate',
      width: 160,
      align: 'left',
      values: (value) => dayjs(value).format(formatDate),
      render(value, record) {
        return (
          <Tooltip
            title={dayjs(value).format(formatDateTime)}
            placement="topLeft"
          >
            {dayjs(value).format(formatDate)}
          </Tooltip>
        );
      },
    },
    {
      title: 'Số thuê bao',
      dataIndex: 'isdn',
      width: 120,
      align: 'left',
      values: (value) => value,
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            {value}
          </Tooltip>
        );
      },
    },
    {
      title: 'Tên KH',
      dataIndex: 'name',
      width: 120,
      align: 'left',
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            {value}
          </Tooltip>
        );
      },
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'birthDate',
      width: 120,
      align: 'left',
      values: (value) => dayjs(value).format(formatDate),
      render(value, record) {
        return (
          <Tooltip title={dayjs(value).format(formatDate)} placement="topLeft">
            {dayjs(value).format(formatDate)}
          </Tooltip>
        );
      },
    },
    {
      title: 'Loại GTTT',
      dataIndex: 'idType',
      width: 120,
      align: 'left',
      values: (value) => idType[value as keyof typeof idType],
      render(value, record) {
        return (
          <Tooltip
            title={idType[value as keyof typeof idType]}
            placement="topLeft"
          >
            {idType[value as keyof typeof idType]}
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
            {value}
          </Tooltip>
        );
      },
    },
    {
      title: 'Loại KH',
      dataIndex: 'custType',
      width: 120,
      align: 'left',
      render(value, record) {
        let text = value;
        if (value === 'VNS') {
          text = 'Cá nhân';
        } else if (value === 'DN') {
          text = 'Doanh nghiệp';
        }
        return (
          <Tooltip title={text} placement="topLeft">
            {text}
          </Tooltip>
        );
      },
    },
    {
      title: 'Trạng thái tiền kiểm',
      dataIndex: 'approveStatus',
      width: 170,
      align: 'center',
      values: (value) => ApproveStatus[value as keyof typeof ApproveStatus],
      render(value, record) {
        return (
          <Tooltip
            title={ApproveStatus[value as keyof typeof ApproveStatus]}
            placement="top"
          >
            <CTag
              color={
                value === 0 //Cho xu ly
                  ? ColorList.WAITING
                  : value === 1 //Duyệt
                  ? ColorList.SUCCESS
                  : value === 2
                  ? ColorList.FAIL //Từ chối
                  : ColorList.DEFAULT
              }
            >
              <FormattedMessage
                id={ApproveStatus[value as keyof typeof ApproveStatus]}
              />
            </CTag>
          </Tooltip>
        );
      },
    },
    {
      title: 'Trạng thái KH',
      dataIndex: 'activeStatus',
      width: 140,
      align: 'center',
      values: (value) => ActiveStatus[value as keyof typeof ActiveStatus],
      render(value, record) {
        return (
          <Tooltip
            title={ActiveStatus[value as keyof typeof ActiveStatus]}
            placement="top"
          >
            <CTag
              color={
                value === 0 //Cho xu ly
                  ? ColorList.WAITING
                  : value === 1 //Thanh cong
                  ? ColorList.SUCCESS
                  : value === 2
                  ? ColorList.FAIL
                  : ColorList.DEFAULT //That bai
              }
            >
              <FormattedMessage
                id={ActiveStatus[value as keyof typeof ActiveStatus]}
              />
            </CTag>
          </Tooltip>
        );
      },
    },
    {
      title: 'Lý do',
      dataIndex: 'reasonReject',
      width: 110,
      align: 'left',
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            {value}
          </Tooltip>
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'common.action' }),
      align: 'center',
      width: 150,
      searchDisiable: true,
      fixed: 'right',
      render(_, record) {
        return (
          <WrapperActionTable>
            {includes(listRoleByRouter, ActionsTypeEnum.READ) && (
              <CButtonDetail
                type="default"
                onClick={() => openModalEditView(ActionType.VIEW, record)}
              >
                {<FormattedMessage id={'Xem chi tiết'} />}
              </CButtonDetail>
            )}
            <div className="w-5">
              <Dropdown
                menu={{ items: renderMenuItemsMore(record) }}
                placement="bottom"
                trigger={['click']}
              >
                <IconMore className="iconMore" />
              </Dropdown>
            </div>
          </WrapperActionTable>
        );
      },
    },
  ];

  const changeHeightTable = () => {
    const heightWrapper =
      document.getElementById('wrapperUserGroup')?.offsetHeight;
    setHeightTable((heightWrapper ?? 0) - 205);
  };

  const openModalEditView = (type: ActionType, record: ContentItem) => {
    return navigate(pathRoutes.activationApproveListView(record.id));
  };

  const handleFinish = (values: any) => {
    const { rangePicker, ...rest } = values;
    const [fromDate, toDate] = rangePicker || [
      dayjs().subtract(29, 'day'),
      dayjs(),
    ];
    const filters = params.filters ?? 1;
    setSearchParams({
      ...params,
      ...rest,
      type: '1',
      fromDate: fromDate ? fromDate.format(formatDate) : null,
      toDate: toDate ? toDate.format(formatDate) : null,
      page: 0,
      size: 1000,
      filters,
    });
    setClickSearch(true);
    handleSearch(params);
  };

  const handleCancel = () => {
    setIsOpenSensorModal(false);
    formDocument.resetFields();
  };

  const handleStartAccept = () => {
    formDocument.resetFields();
    setIsOpenSensorModal(false);
    setIsOpenProcess(true);
  };

  return (
    <div>
      <TitleHeader>Danh sách tiền kiểm</TitleHeader>
      <RowHeader>
        <Form
          form={form}
          colon={false}
          onFinish={handleFinish}
          initialValues={{ type: '1' }}
        >
          <Row gutter={[12, 24]}>
            <Col>
              <CFilter
                items={items}
                searchComponent={
                  <Form.Item name={'number'}>
                    <CInput
                      placeholder="Nhập số thuê bao"
                      maxLength={11}
                      onlyNumber
                    />
                  </Form.Item>
                }
              />
            </Col>
            <Form.Item name="listIds" hidden></Form.Item>
          </Row>
        </Form>
      </RowHeader>

      <RowHeader className={'!justify-end'}>
        <Form form={formSelect} onFinish={handleFinishSelect}>
          <Row gutter={[5, 24]}>
            <Col span={4}>
              <Form.Item name={'recordFrom'}>
                <CInputNumber
                  type="number"
                  placeholder="Nhập số bản ghi từ"
                  min={1}
                  max={1000}
                  precision={0}
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                    ['-', '+', '.', 'e', ','].includes(e.key) &&
                    e.preventDefault()
                  }
                />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name={'recordTo'}>
                <CInputNumber
                  type="number"
                  placeholder="Nhập số bản ghi đến"
                  min={1}
                  max={1000}
                  precision={0}
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                    ['-', '+', '.', 'e', ','].includes(e.key) &&
                    e.preventDefault()
                  }
                />
              </Form.Item>
            </Col>
            <Col span={1.5}>
              <CButton htmlType="submit" disabled={disableSelectBtn}>
                Chọn
              </CButton>
            </Col>
            <Col span={8}>
              <div className="font-medium text-[#ff4d4f] mt-1.5">
                Số bản ghi thực tế khi tìm kiếm: {dataTable?.totalElements ?? 0}
              </div>
            </Col>
          </Row>
        </Form>
        <WrapperButton>
          {includes(listRoleByRouter, ActionsTypeEnum.APPROVED) && (
            <StyledButton
              disableStyle={selectedRowKeys.length === 0}
              disabled={selectedRowKeys.length === 0}
              icon={<FontAwesomeIcon icon={faCheck} />}
              onClick={() => setIsOpenSensorModal(true)}
            >
              {intl.formatMessage({ id: 'Phê duyệt' })}
            </StyledButton>
          )}
          {includes(listRoleByRouter, ActionsTypeEnum.REJECT) && (
            <StyledButton
              disableStyle={selectedRowKeys.length === 0}
              disabled={selectedRowKeys.length === 0}
              onClick={() => setIsOpenModal(true)}
              icon={<FontAwesomeIcon icon={faCancel} />}
              style={
                selectedRowKeys.length !== 0 && {
                  backgroundColor: '#ff4d4d',
                  borderColor: '#ff4d4d',
                  color: 'white',
                }
              }
            >
              {intl.formatMessage({ id: 'Từ chối' })}
            </StyledButton>
          )}
          {includes(listRoleByRouter, ActionsTypeEnum.EXPORT_EXCEL) && (
            <CButtonExport onClick={onDownload}>
              {intl.formatMessage({ id: 'Xuất file excel' })}
            </CButtonExport>
          )}
        </WrapperButton>
      </RowHeader>
      {!loadingTable && (
        <>
          <Space style={{ marginBottom: 16 }}></Space>
          <CTableSearch
            columns={columns}
            rowKey={'id'}
            rowSelection={rowSelection}
            dataSource={dataTable?.content}
            pagination={{
              current: paramsTab.page + 1,
              pageSize: paramsTab.size,
              total: dataTable?.totalElements,
            }}
            onChange={handleChangeTable}
            loading={loadingTable}
          />
        </>
      )}
      <CModal
        title={'Chuyển hồ sơ'}
        open={isOpenSensorModal}
        onCancel={handleCancel}
        footer={[
          <CButtonClose key="close" type="default" onClick={handleCancel}>
            Đóng
          </CButtonClose>,
          <CButton
            key="submit"
            htmlType="submit"
            onClick={() => {
              if (formDocument.getFieldValue('passSensor') === 0) {
                setIsPassSensor(false);
              } else if (formDocument.getFieldValue('passSensor') === 1) {
                setIsPassSensor(true);
              }
              formDocument.submit();
            }}
            icon={<FontAwesomeIcon icon={faCheck} />}
          >
            Xác nhận
          </CButton>,
        ]}
      >
        <Form
          form={formDocument}
          colon={false}
          layout="vertical"
          onFinish={handleStartAccept}
          validateTrigger={['onSubmit']}
          // initialValues={{'passSensor': -1}}
        >
          <Form.Item
            label="Chọn hồ sơ"
            name="passSensor"
            rules={[
              {
                required: true,
                message: 'Không được để trống trường này',
              },
            ]}
          >
            <CSelect
              showSearch={false}
              placeholder="Chọn hồ sơ"
              options={reasonOptions}
            />
          </Form.Item>
        </Form>
      </CModal>
      <RejectModal
        isOpen={isOpenModal}
        setIsOpen={setIsOpenModal}
        selectedRowKeys={selectedRowKeys}
        setSelectedRowKeys={setSelectedRowKeys}
      />
      {isOpenProcess && (
        <AcceptModal
          isOpenProcess={isOpenProcess}
          setIsOpenProcess={setIsOpenProcess}
          selectedRowKeys={selectedRowKeys}
          setSelectedRowKeys={setSelectedRowKeys}
          isPassSensor={isPassSensor}
        />
      )}
    </div>
  );
};

export default Body;
