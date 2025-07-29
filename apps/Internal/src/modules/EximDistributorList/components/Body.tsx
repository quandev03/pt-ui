import { CButtonDetail } from '@react/commons/Button';
import CTable from '@react/commons/Table';
import { Text, WrapperActionTable } from '@react/commons/Template/style';
import { decodeSearchParams, queryParams } from '@react/helpers/utils';
import { Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import dayjs from 'dayjs';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { moveMethod } from '../constant';
import { useListEximDistributor } from '../queryHook/useListEximDistributor';
import { IColumnListEximDistributor } from '../type';
import Header from './Header';
import {
  formatDate,
  formatDateBe,
  formatDateTime,
} from '@react/constants/moment';

const Body = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { data: listEximDistributor } = useListEximDistributor(
    queryParams(params)
  );

  const columns: ColumnsType<IColumnListEximDistributor> = [
    {
      title: 'STT',
      fixed: 'left',
      width: 50,
      render(_, __, index) {
        return <Text>{index + 1 + params.page * params.size}</Text>;
      },
    },

    {
      title: 'Mã phiếu',
      dataIndex: 'deliveryNoteCode',
      width: 150,
      render(value) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },

    {
      title: 'Mã giao dịch',
      dataIndex: 'stockMoveCode',
      width: 100,
      render(value) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },

    {
      title: 'Loại GD',
      dataIndex: 'moveMethod',
      width: 100,
      render(value) {
        const getMoveMethodLabel = (value: number) => {
          const method = moveMethod.find((method) => method.value === value);
          return method ? method.label : '';
        };
        return (
          <Tooltip title={getMoveMethodLabel(value)} placement="topLeft">
            <Text>{getMoveMethodLabel(value)}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Người tạo',
      dataIndex: 'createdBy',
      width: 240,
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Ngày lập',
      dataIndex: 'moveDate',
      width: 150,
      render(value) {
        return (
          <Tooltip title={dayjs(value).format(formatDate)} placement="topLeft">
            <Text>{dayjs(value).format(formatDate)}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdDate',
      width: 120,
      render(value) {
        const formatValue = value
          ? dayjs(value, formatDateBe).format(formatDate)
          : '';
        const formatValueV2 = value
          ? dayjs(value, formatDateBe).format(formatDateTime)
          : '';
        return (
          <Tooltip title={formatValueV2} placement="topLeft">
            <Text>{formatValue}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Người cập nhật',
      dataIndex: 'modifiedBy',
      width: 240,
      render(value, record) {
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
      width: 130,
      render(value) {
        const formatValue = value
          ? dayjs(value, formatDateBe).format(formatDate)
          : '';
        const formatValueV2 = value
          ? dayjs(value, formatDateBe).format(formatDateTime)
          : '';
        return (
          <Tooltip title={formatValueV2} placement="topLeft">
            <Text>{formatValue}</Text>
          </Tooltip>
        );
      },
    },

    {
      title: 'Thao tác',
      dataIndex: 'action',
      width: 180,
      fixed: 'right',
      render(value, record) {
        return (
          <WrapperActionTable>
            <CButtonDetail
              onClick={() =>
                navigate(pathRoutes.eximDistributorTransactionView(record.id))
              }
            />
          </WrapperActionTable>
        );
      },
    },
  ];

  return (
    <>
      <Header />
      <CTable
        columns={columns}
        dataSource={listEximDistributor?.content ?? []}
        pagination={{
          total: listEximDistributor?.totalElements ?? 0,
        }}
      />
    </>
  );
};

export default Body;
