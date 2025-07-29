import CTable from '@react/commons/Table';
import { Text } from '@react/commons/Template/style';
import { decodeSearchParams, queryParams } from '@react/helpers/utils';
import { Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useListInventoryDetail } from '../queryHook/useList';
import { IInventoryDetail, ParamsInventoryDetail } from '../types';
import Header from './Header';

const Body: React.FC = () => {
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { data: dataInventory, isLoading: loadingTable } =
    useListInventoryDetail(queryParams<ParamsInventoryDetail>(params));

  const columns: ColumnsType<IInventoryDetail> = [
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
      title: 'Loại sản phẩm',
      dataIndex: 'productCategoryName',
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
      title: 'Đơn vị',
      dataIndex: 'productUom',
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
      title: 'Số lượng tồn',
      dataIndex: 'quantity',
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
  ];
  return (
    <>
      <Header />
      <CTable
        loading={loadingTable}
        columns={columns}
        dataSource={dataInventory?.content ?? []}
        rowKey={'id'}
        pagination={{
          total: dataInventory?.totalElements,
        }}
      />
    </>
  );
};

export default Body;
