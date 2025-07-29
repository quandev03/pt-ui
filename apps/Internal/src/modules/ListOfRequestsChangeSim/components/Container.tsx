import { CButtonDetail } from '@react/commons/Button';
import CTable from '@react/commons/Table';
import CTag from '@react/commons/Tag';
import { Text, WrapperActionTable } from '@react/commons/Template/style';
import { ActionsTypeEnum, DateFormat } from '@react/constants/app';
import { ColorList } from '@react/constants/color';
import {
  decodeSearchParams,
  formatCurrencyVND,
  queryParams,
} from '@react/helpers/utils';
import { Dropdown, MenuProps, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { ReactComponent as IconMore } from 'apps/Internal/src/assets/images/IconMore.svg';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import dayjs from 'dayjs';
import includes from 'lodash/includes';
import { useCallback, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ContentItem,
  useGetChangeSimSearch,
} from '.././hooks/useGetChangeSimSearch';
import { SendEmailQrSimModal } from './SendEmailQrSimModal';
enum SimTypeEnum {
  PhysicalSim = '1',
  Esim = '2',
}
const Container = () => {
  const navigate = useNavigate();
  const actionByRole = useRolesByRouter();
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { data: dataTable, isFetching } = useGetChangeSimSearch(
    queryParams(params)
  );
  const [openSendQrESIMModal, setOpenSendQrESIMModal] = useState(false);
  const [email, setEmail] = useState('');
  const [requestId, setRequestId] = useState('');
  const handleCloseModalSendQrESIM = useCallback(() => {
    setEmail('');
    setRequestId('');
    setOpenSendQrESIMModal(false);
  }, [setOpenSendQrESIMModal, setEmail, setRequestId]);
  const handleOpenSendQrESIMModal = useCallback(
    (record: ContentItem) => {
      setRequestId(record.requestId);
      setEmail(record.email);
      setOpenSendQrESIMModal(true);
    },
    [setOpenSendQrESIMModal, setEmail, setRequestId]
  );
  const textRender = (children: any, record: ContentItem) => {
    return (
      <Text type={record.expire === true ? 'danger' : undefined}>
        {children}
      </Text>
    );
  };

  const columns: ColumnsType<ContentItem> = [
    {
      title: 'STT',
      dataIndex: 'stt',
      width: 50,
      fixed: 'left',
      render: (_, record, idx: number) => {
        return (
          <div>{textRender(params.page * params.size + idx + 1, record)}</div>
        );
      },
    },
    {
      title: 'Mã đơn hàng',
      dataIndex: 'saleOrderNo',
      width: 180,
      fixed: 'left',
      render: (value: string, record) => {
        return (
          <Tooltip title={value} placement="topLeft">
            {textRender(value, record)}
          </Tooltip>
        );
      },
    },
    {
      title: 'Tên khách hàng',
      dataIndex: 'fullName',
      width: 180,
      fixed: 'left',
      render: (value: string, record) => {
        return (
          <Tooltip title={value} placement="topLeft">
            {textRender(value, record)}
          </Tooltip>
        );
      },
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber',
      width: 110,
      render: (value: string, record) => {
        return (
          <Tooltip title={value} placement="topLeft">
            {textRender(value, record)}
          </Tooltip>
        );
      },
    },
    {
      title: 'Số liên hệ',
      dataIndex: 'receiverPhone',
      width: 110,
      render: (value: string, record) => {
        return (
          <Tooltip title={value} placement="topLeft">
            {textRender(value, record)}
          </Tooltip>
        );
      },
    },
    {
      title: 'Kênh',
      dataIndex: 'requestType',
      width: 100,
      render: (value: string, record) => {
        return (
          <Tooltip title={value} placement="topLeft">
            {textRender(value, record)}
          </Tooltip>
        );
      },
    },
    {
      title: 'Serial SIM mới',
      dataIndex: 'newSerial',
      width: 180,
      render: (value: string, record) => {
        return (
          <Tooltip title={value} placement="topLeft">
            {textRender(value, record)}
          </Tooltip>
        );
      },
    },
    {
      title: 'Serial SIM cũ',
      dataIndex: 'oldSerial',
      width: 180,
      render: (value: string, record) => {
        return (
          <Tooltip title={value} placement="topLeft">
            {textRender(value, record)}
          </Tooltip>
        );
      },
    },
    {
      title: 'Loại mặt hàng',
      dataIndex: 'requestSimType',
      width: 120,
      render: (value: string, record) => {
        return (
          <Tooltip title={value} placement="topLeft">
            {textRender(value, record)}
          </Tooltip>
        );
      },
    },
    {
      title: 'Kho xuất',
      dataIndex: 'stockName',
      width: 120,
      render: (value: string, record) => {
        return (
          <Tooltip title={value} placement="topLeft">
            {textRender(value, record)}
          </Tooltip>
        );
      },
    },
    {
      title: 'Lý do đổi SIM',
      dataIndex: 'reason',
      width: 200,
      render: (value: string, record) => {
        return (
          <Tooltip title={value} placement="topLeft">
            {textRender(value, record)}
          </Tooltip>
        );
      },
    },
    {
      title: 'Phí yêu cầu đổi SIM',
      dataIndex: 'feeAmount',
      align: 'right',
      width: 150,
      render: (value: string, record) => {
        return (
          <Tooltip title={formatCurrencyVND(value ?? 0)} placement="topRight">
            {textRender(formatCurrencyVND(value ?? 0), record)}
          </Tooltip>
        );
      },
    },
    {
      title: 'Thời gian yêu cầu',
      dataIndex: 'createDateWithTime',
      width: 140,
      render: (value: string, record) => {
        return (
          <Tooltip
            title={value ? dayjs(value).format(DateFormat.DATE_TIME) : null}
            placement="topLeft"
          >
            {textRender(
              value ? dayjs(value).format(DateFormat.DEFAULT) : null,
              record
            )}
          </Tooltip>
        );
      },
    },
    {
      title: 'Thời gian xử lý',
      dataIndex: 'processsDateWithTime',
      width: 140,
      render: (value: string, record) => {
        return (
          <Tooltip
            title={value ? dayjs(value).format(DateFormat.DATE_TIME) : null}
            placement="topLeft"
          >
            {textRender(
              value ? dayjs(value).format(DateFormat.DEFAULT) : null,
              record
            )}
          </Tooltip>
        );
      },
    },
    {
      title: 'User thực hiện',
      dataIndex: 'createdBy',
      width: 120,
      render: (value: string, record) => {
        return (
          <Tooltip title={value} placement="topLeft">
            {record.statusCode !== 0 && textRender(value, record)}
          </Tooltip>
        );
      },
    },
    {
      title: 'Trạng thái thanh toán',
      dataIndex: 'payStatus',
      width: 160,
      render: (value: string, record) => {
        let color: (typeof ColorList)[keyof typeof ColorList] =
          ColorList.DEFAULT;
        if (record.payStatusCode === 0) {
          color = ColorList.FAIL;
        }
        if (record.payStatusCode === 1) {
          color = ColorList.SUCCESS;
        }
        return (
          <Tooltip title={value} placement="topLeft">
            <CTag color={color}>{value}</CTag>
          </Tooltip>
        );
      },
    },
    {
      title: 'Trạng thái xử lý',
      dataIndex: 'status',
      width: 150,
      render: (value: string, record) => {
        let color: (typeof ColorList)[keyof typeof ColorList] =
          ColorList.DEFAULT;
        if (record.statusCode === 0) {
          color = ColorList.FAIL;
        }
        if (record.statusCode === 1) {
          color = ColorList.SUCCESS;
        }
        if (record.statusCode === 2) {
          color = ColorList.FAIL;
        }
        return (
          <Tooltip title={value} placement="topLeft">
            <CTag color={color}>{value}</CTag>
          </Tooltip>
        );
      },
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: 250,
      render: (value: string, record) => {
        return (
          <Tooltip title={value} placement="topLeft">
            {textRender(value, record)}
          </Tooltip>
        );
      },
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      width: 150,
      render: (value: string, record) => {
        return (
          <Tooltip title={value} placement="topLeft">
            {textRender(value, record)}
          </Tooltip>
        );
      },
    },
    {
      title: 'Lý do từ chối',
      dataIndex: 'rejectReason',
      width: 150,
      render: (value: string, record) => {
        return (
          <Tooltip title={value} placement="topLeft">
            {textRender(value, record)}
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
                onClick={() =>
                  navigate(
                    pathRoutes.listOfRequestsChangeSimView(record.requestId)
                  )
                }
              />
            )}
            <div className="w-5">
              {record?.requestSimTypeCode === SimTypeEnum.Esim &&
                record?.statusCode === 1 && //  1 Đã xử lý
                (record?.payStatusCode === 1 ||
                  record?.payStatusCode === null) && ( //  1 Đã thanh toán
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

  const renderMenuItemsMore = (record: ContentItem): MenuProps['items'] => {
    return [
      {
        key: ActionsTypeEnum.UPDATE,
        label: (
          <Text onClick={() => handleOpenSendQrESIMModal(record)}>
            Gửi email QR eSIM
          </Text>
        ),
      },
    ];
  };

  return (
    <div>
      <CTable
        columns={columns}
        dataSource={dataTable?.content ?? []}
        loading={isFetching}
        pagination={{
          total: dataTable?.totalElements,
        }}
      />
      <SendEmailQrSimModal
        open={openSendQrESIMModal}
        onClose={handleCloseModalSendQrESIM}
        email={email}
        requestId={requestId}
      />
    </div>
  );
};

export default Container;
