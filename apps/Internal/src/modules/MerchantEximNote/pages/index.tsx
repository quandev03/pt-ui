import { CButtonDetail } from '@react/commons/Button';
import { CModalConfirm, CTable, CTag, CTooltip } from '@react/commons/index';
import { Text, WrapperActionTable } from '@react/commons/Template/style';
import { DateFormat, SearchTimeMax } from '@react/constants/app';
import { CurrentStatusList } from '@react/constants/status';
import { decodeSearchParams, queryParams } from '@react/helpers/utils';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import { getDate, toLocalISOString } from '@react/utils/datetime';
import { MESSAGE } from '@react/utils/message';
import { getDeliveryNoterStatusColor } from '@react/utils/status';
import { Dropdown, MenuProps, Space, Spin, TableColumnsType } from 'antd';
import { ReactComponent as IconMore } from 'apps/Internal/src/assets/images/IconMore.svg';
import { ParamsOption } from 'apps/Internal/src/components/layouts/types';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ModalProcess from '../../Approval/components/ModalProcess';
import { useViewProcess } from '../../Approval/hooks/useViewProcess';
import Header from '../components/Header';
import { useEditStatusNote } from '../hooks/useEditStatusNote';
import { useListMerchantNote } from '../hooks/useListNote';
import { MerchantNoteType } from '../types';
import { usePrintReport } from '../hooks/usePrintReport';
import dayjs from 'dayjs';
import ModalPrint from '../components/ModalPrint';

const MerchantNotePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams({
    fromDate: dayjs().subtract(29, 'd').startOf('d').format(),
    toDate: dayjs().endOf('d').format(),
  });
  const params = decodeSearchParams(searchParams);
  const { page, size } = params;
  const allParams = useGetDataFromQueryKey<ParamsOption>([
    REACT_QUERY_KEYS.GET_PARAMS,
  ]);
  const [isOpenProcess, setIsOpenProcess] = useState<boolean>(false);
  const [isOpenPrint, setIsOpenPrint] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string>();
  const { data, isFetching: isLoadingList } = useListMerchantNote(
    queryParams(params)
  );
  const { mutate: mutateViewProcess, data: dataProcess } = useViewProcess();
  const { mutate: mutateStatus, isPending: isLoadingStatus } =
    useEditStatusNote();

  const handleView = (id: string) => {
    navigate(pathRoutes.merchantEximViewIm(id));
  };
  const handlePrint = (id: string) => {
    setSelectedId(id);
    setIsOpenPrint(true);
  };
  const handleProcess = (id: string) => {
    setIsOpenProcess(true);
    mutateViewProcess({ id });
  };
  const handleCancelNote = (id: string) => {
    CModalConfirm({
      message: MESSAGE.G15b('phiếu'),
      onOk: () => {
        mutateStatus({ id, status: CurrentStatusList.REFUSE });
      },
    });
  };
  const renderMenuItemsMore = (
    id: string,
    record: MerchantNoteType
  ): MenuProps['items'] => {
    return [
      {
        key: 1,
        label: <Text type="danger">Hủy phiếu</Text>,
        onClick: () => handleCancelNote(id),
        hidden: record.status !== CurrentStatusList.PENDING,
      },
      {
        key: 2,
        label: <Text>Biên bản bàn giao</Text>,
        onClick: () => handlePrint(id),
        hidden: record.status === CurrentStatusList.REFUSE,
      },
      {
        key: 3,
        label: <Text>Tiến độ phê duyệt</Text>,
        onClick: () => handleProcess(id),
        hidden: true,
      },
    ].filter((e) => !e.hidden);
  };

  const columns: TableColumnsType<MerchantNoteType> = [
    {
      title: 'STT',
      dataIndex: 'stt',
      width: 50,
      fixed: 'left',
      render: (_, __, idx: number) => {
        return <div>{page * size + idx + 1}</div>;
      },
    },
    {
      title: 'Mã phiếu',
      dataIndex: 'deliveryNoteCode',
      width: 150,
      render: (value: string) => {
        return <CTooltip title={value}>{value}</CTooltip>;
      },
    },
    {
      title: 'Mã đơn hàng',
      dataIndex: 'orderNo',
      width: 140,
      render: (value: string) => {
        return <CTooltip title={value}>{value}</CTooltip>;
      },
    },
    {
      title: 'Ngày lập phiếu',
      dataIndex: 'deliveryNoteDate',
      width: 120,
      render: (value: string) => {
        return (
          <CTooltip title={getDate(value, DateFormat.DEFAULT)}>
            {getDate(value)}
          </CTooltip>
        );
      },
    },
    {
      title: 'Người tạo',
      dataIndex: 'createdBy',
      width: 140,
      render: (value: string) => {
        return <CTooltip title={value}>{value}</CTooltip>;
      },
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdDate',
      width: 100,
      render: (value: string) => {
        return (
          <CTooltip title={getDate(value, DateFormat.DATE_TIME)}>
            {getDate(value)}
          </CTooltip>
        );
      },
    },
    {
      title: 'Người cập nhật',
      dataIndex: 'modifiedBy',
      width: 140,
      render: (value: string) => {
        return <CTooltip title={value}>{value}</CTooltip>;
      },
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'modifiedDate',
      width: 120,
      render: (value: string) => {
        return (
          <CTooltip title={getDate(value, DateFormat.DATE_TIME)}>
            {getDate(value)}
          </CTooltip>
        );
      },
    },
    {
      title: <span>Trạng thái phiếu</span>,
      dataIndex: 'status',
      width: 140,
      render: (value: number) => {
        const statusName = allParams?.DELIVERY_NOTE_STATUS?.find(
          (e) => +e.value === value
        )?.label;
        return (
          <CTag color={getDeliveryNoterStatusColor(value)}>{statusName}</CTag>
        );
      },
    },
    {
      title: 'Thao tác',
      dataIndex: 'id',
      width: 130,
      align: 'center',
      fixed: 'right',
      render: (value, record) => (
        <WrapperActionTable>
          <CButtonDetail type="default" onClick={() => handleView(value)} />
          <Dropdown
            menu={{ items: renderMenuItemsMore(value, record) }}
            placement="bottom"
            trigger={['click']}
          >
            <IconMore className="cursor-pointer" />
          </Dropdown>
        </WrapperActionTable>
      ),
    },
  ];

  return (
    <>
      <Header />
      <CTable
        rowKey={'id'}
        columns={columns}
        dataSource={data?.content ?? []}
        pagination={{
          current: +page + 1,
          pageSize: +size,
          total: data?.totalElements,
        }}
        loading={isLoadingList || isLoadingStatus}
      />
      <ModalProcess
        data={dataProcess}
        isOpen={isOpenProcess}
        setIsOpen={setIsOpenProcess}
      />
      <ModalPrint
        id={selectedId}
        isOpen={isOpenPrint}
        setIsOpen={setIsOpenPrint}
      />
    </>
  );
};

export default MerchantNotePage;
