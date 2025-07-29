import CTable from '@react/commons/Table';
import CTag from '@react/commons/Tag';
import { Text } from '@react/commons/Template/style';
import { ColorList } from '@react/constants/color';
import { decodeSearchParams, queryParams } from '@react/helpers/utils';
import { Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useListSerialLookup } from '../queryHook/useList';
import { ISerialLookup } from '../types';
import Header from './Header';
import { ParamsOption } from 'apps/Partner/src/components/layouts/types';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import { REACT_QUERY_KEYS } from 'apps/Partner/src/constants/querykeys';

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
}

const KitStatus = {
  [StatusEnum.IN_STOCK]: ColorList.CANCEL,
  [StatusEnum.AWAITING_STOCK]: ColorList.PROCESSING,
  [StatusEnum.SOLD]: ColorList.SUCCESS,
};

const Body: React.FC = () => {
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);

  const { data: dataSerial, isLoading: loadingTable } = useListSerialLookup(
    queryParams(params)
  );

  const {
    STOCK_PRODUCT_SERIAL_KIT_STATUS = [],
    PRODUCT_CATEGORY_CATEGORY_TYPE = [],
  } = useGetDataFromQueryKey<ParamsOption>([
    REACT_QUERY_KEYS.GET_PARAMS_OPTION,
  ]);
  const columns: ColumnsType<ISerialLookup> = [
    {
      title: 'STT',
      align: 'left',
      fixed: 'left',
      width: 50,
      render(value, record, index) {
        return <Text>{index + 1 + params.page * params.size}</Text>;
      },
    },

    {
      title: 'Serial',
      dataIndex: 'serial',
      width: 160,
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
      title: 'Số thuê bao',
      dataIndex: 'isDn',
      width: 130,
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
      title: 'Mã sản phẩm',
      dataIndex: 'productCode',
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
      title: 'Tên sản phẩm',
      dataIndex: 'productName',
      width: 130,
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
      title: 'Mã kho',
      dataIndex: 'orgCode',
      width: 100,
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
      title: 'Tên kho	',
      dataIndex: 'orgName',
      width: 100,
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
      title: 'Loại SIM',
      dataIndex: 'simType',
      width: 100,
      align: 'left',
      render(value, record) {
        const simType = PRODUCT_CATEGORY_CATEGORY_TYPE?.find(
          (e) => e.value == value
        )?.label;
        return (
          <Tooltip title={simType} placement="topLeft">
            <Text>{simType}</Text>
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
        return (
          <Tooltip title={statusName} placement="topLeft">
            <CTag color={KitStatusColor[kitStatus]}>{statusName}</CTag>
          </Tooltip>
        );
      },
    },
  ];
  return (
    <>
      <Header />
      <CTable
        loading={loadingTable}
        columns={columns}
        dataSource={dataSerial ? dataSerial.content : []}
        rowKey={'id'}
        pagination={{
          total: dataSerial?.totalElements,
        }}
        otherHeight={50}
      />
    </>
  );
};

export default Body;
