import CButton, { CButtonDetail, CButtonExport } from '@react/commons/Button';
import {
  BtnGroupFooter,
  Text,
  TitleHeader,
  WrapperActionTable,
} from '@react/commons/Template/style';
import { ActionsTypeEnum, ActionType } from '@react/constants/app';
import type { MenuProps, TablePaginationConfig } from 'antd';
import { Dropdown, Form, Space, Tooltip } from 'antd';
import ModalConfirm from 'apps/Internal/src/components/modalConfirm';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useList } from '../queryHook/useList';
import { ActiveStatus, ApproveStatus, ContentItem, idType } from '../types';
import { useCallback, useEffect, useState } from 'react';
import CTableSearch, { ExtendedColumnsType } from '@react/commons/TableSearch';
import CTag from '@react/commons/Tag';
import { decodeSearchParams, queryParams } from '@react/helpers/utils';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { formatDate, formatDateTime } from '@react/constants/moment';
import dayjs from 'dayjs';
import { useCancelFn } from '../queryHook/useCancelRequest';
import Header from './Header';
import { ReactComponent as IconMore } from 'apps/Internal/src/assets/images/IconMore.svg';
import useSearchHandler from '@react/hooks/useSearchHandler';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useExportList } from '../queryHook/useExport';
import { includes } from 'lodash';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import { ColorList } from '@react/constants/color';

const TotalTableMessage = (total: number) => {
  return (
    <>
      <FormattedMessage id="common.total" />
      {' ' + 1100 + ' '}
      <FormattedMessage id="common.item" />
    </>
  );
};

const Body: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [form] = Form.useForm();
  const intl = useIntl();
  const { mutate: cancelMutate } = useCancelFn(form);
  const { mutateAsync: mutateExport } = useExportList();
  const [paramsTab, setParamsTab] = useState({ page: 0, size: 20 });
  const params = decodeSearchParams(searchParams);
  const { handleSearch } = useSearchHandler(
    REACT_QUERY_KEYS.GET_LIST_OF_ACTIVE_REQUEST_LIST
  );
  const { isLoading: loadingTable, data: dataTable } = useList(
    queryParams(params)
  );
  const listRoleByRouter = useRolesByRouter();
  const [heightTable, setHeightTable] = useState(0);
  useEffect(() => {
    const id = setTimeout(changeHeightTable, 500);
    return () => {
      clearTimeout(id);
    };
  }, []);

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

  const handleCancelRequest = (id: string) => {
    ModalConfirm({
      title: 'Xác nhận',
      message: 'Bạn có chắc chắn muốn Hủy yêu cầu kích hoạt này?',
      handleConfirm: () => {
        form.setFieldValue('listIds', [id]);
        console.log('FORM HERE ', form.getFieldsValue());

        cancelMutate(form.getFieldsValue());
      },
    });
  };

  const renderMenuItemsMore = (record: ContentItem): MenuProps['items'] => {
    const extendedMenu = [];
    if (
      record.approveStatus == '0' &&
      includes(listRoleByRouter, ActionsTypeEnum.CANCEL)
    ) {
      extendedMenu.push({
        key: ActionsTypeEnum.DELETE,
        label: record.approveStatus == '0' && (
          <Text onClick={() => handleCancelRequest(record.id)}>
            <FormattedMessage id={'Hủy yêu cầu'} />
          </Text>
        ),
      });
    } else if (
      record.approveStatus == '2' &&
      includes(listRoleByRouter, ActionsTypeEnum.UPDATE)
    ) {
      extendedMenu.push({
        key: ActionsTypeEnum.UPDATE,
        label: record.approveStatus == '2' && (
          <Text onClick={() => openModalEditView(ActionType.EDIT, record)}>
            <FormattedMessage id={'common.edit'} />
          </Text>
        ),
      });
    }
    return extendedMenu;
  };

  const columns: ExtendedColumnsType<ContentItem> = [
    {
      title: 'STT',
      align: 'left',
      width: 50,
      searchDisiable: true,
      fixed: 'left',
      render(_, record, index) {
        const stt = index + 1 + paramsTab.page * paramsTab.size;
        return <Text>{stt}</Text>;
      },
    },
    {
      title: 'Số hợp đồng',
      dataIndex: 'contractNo',
      width: 140,
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
      title: 'Ngày tiền  kiểm',
      dataIndex: 'approveDate',
      width: 140,
      align: 'left',
      values: (value) => dayjs(value).format(formatDate),
      render(value, record) {
        return (
          <Tooltip
            title={value ? dayjs(value).format(formatDateTime) : null}
            placement="topLeft"
          >
            {value ? dayjs(value).format(formatDate) : null}
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
                      : ColorList.CANCEL
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
      width: 150,
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
      title: 'Lý do từ chối',
      dataIndex: 'reasonReject',
      width: 130,
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
      fixed: 'right',
      searchDisiable: true,
      render(_, record) {
        return (
          <WrapperActionTable>
            {record.approveStatus != '1' && (
              <>
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
              </>
            )}
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
    return navigate(
      type === ActionType.EDIT
        ? pathRoutes.activationRequestListEdit(record.id)
        : pathRoutes.activationRequestListView(record.id)
    );
  };

  const handleAdd = () => {
    navigate(pathRoutes.activationRequestListCreate);
  };

  const onDownload = () => {
    mutateExport(params);
  };

  const handleFinish = (values: any) => {
    const { rangePicker, type, ...rest } = values;
    const [fromDate, toDate] = rangePicker || [
      dayjs().subtract(29, 'day'),
      dayjs(),
    ];
    const newType = type ?? '1';
    const filters = params.filters ?? 1;
    setSearchParams({
      ...params,
      ...rest,
      type: newType,
      fromDate: fromDate.format(formatDate),
      toDate: toDate.format(formatDate),
      page: 0,
      size: 1000,
      filters,
    });
    handleSearch(params);
  };

  return (
    <div>
      <TitleHeader>Danh sách yêu cầu kích hoạt</TitleHeader>
      <Form
        form={form}
        colon={false}
        onFinish={handleFinish}
        initialValues={{ type: 1 }}
      >
        <Header />
      </Form>
      <div className="flex">
        <div className="font-medium text-[#ff4d4f] mt-1.5">
          Số bản ghi thực tế khi tìm kiếm: {dataTable?.totalElements ?? 0}
        </div>
        <BtnGroupFooter className="items-end">
          {(includes(listRoleByRouter, ActionsTypeEnum.CREATE) ||
            includes(
              listRoleByRouter,
              ActionsTypeEnum.CREATE_MASH_REQUEST
            )) && (
              <CButton
                icon={<FontAwesomeIcon icon={faPlus} />}
                onClick={handleAdd}
              >
                {intl.formatMessage({ id: 'Tạo yêu cầu' })}
              </CButton>
            )}
          {includes(listRoleByRouter, ActionsTypeEnum.EXPORT_EXCEL) && (
            <CButtonExport onClick={onDownload}></CButtonExport>
          )}
        </BtnGroupFooter>
      </div>
      <br />
      {!loadingTable && (
        <>
          <Space style={{ marginBottom: 16 }}></Space>
          <CTableSearch
            rowKey="id"
            columns={columns}
            dataSource={dataTable?.content}
            pagination={{
              current: paramsTab.page + 1,
              pageSize: paramsTab.size,
              total: dataTable?.totalElements,
              showTotal: TotalTableMessage,
              totalElements: dataTable?.totalElements,
            }}
            onChange={handleChangeTable}
            loading={loadingTable}
          />
        </>
      )}
    </div>
  );
};

export default Body;
