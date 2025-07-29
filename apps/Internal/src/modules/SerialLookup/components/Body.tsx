import CTable from '@react/commons/Table';
import CTag from '@react/commons/Tag';
import { Text } from '@react/commons/Template/style';
import { ColorList } from '@react/constants/color';
import { decodeSearchParams, queryParams } from '@react/helpers/utils';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import { Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { ParamsOption } from 'apps/Internal/src/components/layouts/types';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useListSerialLookup } from '../queryHook/useList';
import { ISerialLookup } from '../types';
import Header from './Header';

enum KitStatusEnum {
  NOT_USE = 1,
  ASSEMBLING_KIT = 2,
  KIT_ASSEMBLED = 3,
  ACTIVE = 4,
  REJECT = 5,
}

const KitStatusColor = {
  [KitStatusEnum.NOT_USE]: ColorList.CANCEL,
  [KitStatusEnum.ASSEMBLING_KIT]: ColorList.PROCESSING,
  [KitStatusEnum.KIT_ASSEMBLED]: ColorList.SUCCESS,
  [KitStatusEnum.ACTIVE]: ColorList.SUCCESS,
  [KitStatusEnum.REJECT]: ColorList.FAIL,
};

enum StatusEnum {
  IN_STOCK = 1,
  AWAITING_STOCK = 2,
  SOLD = 3,
  EXPORTED = 4,
}

const KitStatus = {
  [StatusEnum.IN_STOCK]: ColorList.CANCEL,
  [StatusEnum.AWAITING_STOCK]: ColorList.PROCESSING,
  [StatusEnum.SOLD]: ColorList.SUCCESS,
  [StatusEnum.EXPORTED]: ColorList.SUCCESS,
};

const Body: React.FC = () => {
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);

  const { data: dataSerial, isLoading: loadingTable } = useListSerialLookup(
    queryParams(params)
  );

  const {
    STOCK_PRODUCT_SERIAL_KIT_STATUS = [],
    STOCK_PRODUCT_SERIAL_STATUS = [],
    PRODUCT_CATEGORY_CATEGORY_TYPE = [],
  } = useGetDataFromQueryKey<ParamsOption>([REACT_QUERY_KEYS.GET_PARAMS]);

  const columns: ColumnsType<ISerialLookup> = [
    {
      title: 'STT',
      align: 'left',
      fixed: 'left',
      width: 50,
      render(_, __, index) {
        return <Text>{index + 1 + params.page * params.size}</Text>;
      },
    },

    {
      title: 'Serial',
      dataIndex: 'serial',
      width: 160,
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
      title: 'Số thuê bao',
      dataIndex: 'isDn',
      width: 130,
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
      title: 'Mã sản phẩm',
      dataIndex: 'productCode',
      width: 120,
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
      title: 'Tên sản phẩm',
      dataIndex: 'productName',
      width: 130,
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
      title: 'Mã kho',
      dataIndex: 'orgCode',
      width: 100,
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
      title: 'Loại SIM',
      dataIndex: 'simType',
      width: 100,
      align: 'left',
      render(value) {
        const text =
          PRODUCT_CATEGORY_CATEGORY_TYPE.find((item) => item.value == value)
            ?.label ?? '';
        return (
          <Tooltip title={text} placement="topLeft">
            <Text>{text}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Tên kho	',
      dataIndex: 'orgName',
      width: 100,
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
      title: 'Trạng thái',
      dataIndex: 'kitStatus',
      width: 120,
      render: (value) => {
        const kitStatus: KitStatusEnum = Number(value);
        const statusName = STOCK_PRODUCT_SERIAL_KIT_STATUS?.find(
          (e) => e.value == value
        )?.label;
        return <CTag color={KitStatusColor[kitStatus]}>{statusName}</CTag>;
      },
    },

    {
      title: 'Trạng thái phân phối',
      dataIndex: 'status',
      width: 110,
      render: (value: number) => {
        const status: StatusEnum = Number(value);
        const statusName = STOCK_PRODUCT_SERIAL_STATUS?.find(
          (e) => e.value == value
        )?.label;
        return <CTag color={KitStatus[status]}>{statusName}</CTag>;
      },
    },
  ];
  return (
    <>
      <Header />
      <CTable
        loading={loadingTable}
        columns={columns}
        className="dynamic-table"
        dataSource={dataSerial ? dataSerial.content : []}
        pagination={{
          total: dataSerial?.totalElements,
        }}
        otherHeight={50}
      />
    </>
  );
};

export default Body;
