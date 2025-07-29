import CButton from '@react/commons/Button';
import CTable from '@react/commons/Table';
import { Text } from '@react/commons/Template/style';
import { DateFormat } from '@react/constants/app';
import {
  decodeSearchParams,
  formatCurrencyVND,
  queryParams,
} from '@react/helpers/utils';
import { Space, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import ModalConfirm from 'apps/Internal/src/components/modalConfirm';
import dayjs from 'dayjs';
import { useCallback, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  STOCK_ISDN_STATUS_COLOR,
  STOCK_ISDN_TRANSFER_STATUS_COLOR,
  TRANSFER_STATUS_ENUM,
} from '../constant';
import { useKeepIsdn } from '../queryHook/useKeepIsdn';
import { useSearch } from '../queryHook/useSearch';
import { useUnKeepIsdn } from '../queryHook/useUnKeepIsdn';
import { IState } from '../type';
import ModalHistoryPhoneNumber from './Modal/ModalHistoryPhoneNumber';
import CTag from '@react/commons/Tag';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import { ParamsOption } from '@react/commons/types';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';

const Body = () => {
  const [state, setState] = useState<IState>({
    status: false,
    isdn: '',
  });
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);

  const { data: searchData, isFetching } = useSearch(queryParams(params));
  const { mutate: getKeepIsdn } = useKeepIsdn();
  const { mutate: getUnKeepIsdn } = useUnKeepIsdn();

  const { STOCK_ISDN_STATUS = [], STOCK_ISDN_TRANSFER_STATUS = [] } =
    useGetDataFromQueryKey<ParamsOption>([REACT_QUERY_KEYS.GET_PARAMS]);

  const columns: ColumnsType = [
    {
      title: 'STT',
      align: 'left',
      fixed: 'left',
      width: 50,
      render: (value, record, index) => (
        <Tooltip title={index + 1} placement="topLeft">
          <Text>{index + 1 + params.page * params.size}</Text>
        </Tooltip>
      ),
    },
    {
      title: 'Kho số',
      dataIndex: 'stockName',
      width: 180,
      align: 'left',
      fixed: 'left',
      render: (value) => (
        <Tooltip title={value} placement="topLeft">
          <Text>{value}</Text>
        </Tooltip>
      ),
    },
    {
      title: 'Số',
      dataIndex: 'isdn',
      width: 180,
      align: 'left',
      fixed: 'left',
      render: (value) => (
        <Tooltip title={value} placement="topLeft">
          <Text>{value}</Text>
        </Tooltip>
      ),
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      width: 150,
      align: 'right',
      render: (value) => (
        <Tooltip
          title={value ? Number(value).toLocaleString('vi-VN') : ''}
          placement="topRight"
        >
          <Text>{formatCurrencyVND(Number(value))}</Text>
        </Tooltip>
      ),
    },
    {
      title: 'Mã định dạng số',
      dataIndex: 'patternCode',
      width: 150,
      align: 'left',
      render: (value) => (
        <Tooltip title={value} placement="topLeft">
          <Text>{value}</Text>
        </Tooltip>
      ),
    },
    {
      title: 'Tên định dạng số',
      dataIndex: 'patternName',
      width: 180,
      align: 'left',
      render: (value) => (
        <Tooltip title={value} placement="topLeft">
          <Text>{value}</Text>
        </Tooltip>
      ),
    },
    {
      title: 'Người giữ số',
      dataIndex: 'holdingUserFullName',
      width: 180,
      align: 'left',
      render: (value, record) => (
        <div className="flex flex-col">
          {record.patternName === '' ||
            (record.holdingUntilDateTime && (
              <Tooltip title={value} placement="topLeft">
                <Text>{value}</Text>
              </Tooltip>
            ))}
        </div>
      ),
    },
    {
      title: 'Thời gian giữ số',
      dataIndex: 'holdingUntilDateTime',
      width: 180,
      align: 'left',
      render: (value) => (
        <Tooltip
          title={value ? dayjs(value).format(DateFormat.DATE_TIME) : ''}
          placement="topLeft"
        >
          <Text>{value ? dayjs(value).format(DateFormat.DEFAULT) : ''}</Text>
        </Tooltip>
      ),
    },
    {
      title: 'Trạng thái điều chuyển',
      dataIndex: 'transferStatus',
      width: 180,
      align: 'left',
      render: (value) => {
        const text =
          STOCK_ISDN_TRANSFER_STATUS.find((item) => item.value == value)
            ?.label ?? '';
        return (
          <Tooltip title={text} placement="topLeft">
            <CTag
              color={
                STOCK_ISDN_TRANSFER_STATUS_COLOR[value as TRANSFER_STATUS_ENUM]
              }
            >
              {text}
            </CTag>
          </Tooltip>
        );
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 180,
      align: 'left',
      render: (value) => {
        const text =
          STOCK_ISDN_STATUS.find((item) => item.value == value)?.label ?? '';
        return (
          <Tooltip title={text} placement="topLeft">
            <CTag
              color={STOCK_ISDN_STATUS_COLOR[value as TRANSFER_STATUS_ENUM]}
            >
              {text}
            </CTag>
          </Tooltip>
        );
      },
    },
    {
      title: 'Thao tác',
      fixed: 'right',
      width: 200,
      align: 'left',
      render: (
        { isdn, patternName, transferStatus, status, holdingUntilDateTime },
        record
      ) => {
        return (
          <Space size="middle">
            <CButton
              type="default"
              onClick={() => {
                setState(() => ({
                  isdn: isdn,
                  status: true,
                }));
              }}
            >
              Lịch sử
            </CButton>
            <CButton
              className="w-24"
              onClick={() => {
                ModalConfirm({
                  title: 'Xác nhận',
                  message: record.holdingUntilDateTime
                    ? 'Bạn có muốn xác nhận Bỏ giữ số không?'
                    : 'Bạn có muốn xác nhận Giữ số không?',
                  handleConfirm: async () => {
                    if (record.holdingUntilDateTime) {
                      getUnKeepIsdn(isdn);
                    } else {
                      getKeepIsdn(isdn);
                    }
                  },
                });
              }}
              danger={patternName === '' || record.holdingUntilDateTime}
              disabled={!(transferStatus === 1 && status === 1)}
            >
              {record.patternName === '' || record.holdingUntilDateTime
                ? 'Bỏ giữ số'
                : 'Giữ số'}
            </CButton>
          </Space>
        );
      },
    },
  ];

  const handleCloseModal = useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      status: false,
    }));
  }, [setState]);

  return (
    <>
      <CTable
        rowKey="id"
        columns={columns}
        dataSource={searchData?.content || []}
        loading={isFetching}
        pagination={{
          total: searchData?.totalElements,
        }}
      />
      <ModalHistoryPhoneNumber
        isdn={state.isdn}
        onClose={handleCloseModal}
        open={state.status}
      />
    </>
  );
};
export default Body;
