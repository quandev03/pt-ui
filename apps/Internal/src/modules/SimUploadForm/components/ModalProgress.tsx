import { CButtonClose } from '@react/commons/Button';
import { CModal, CTable, CTag, CTooltip } from '@react/commons/index';
import { DateFormat } from '@react/constants/app';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import { getDate } from '@react/utils/datetime';
import { getCurrentStatusColor } from '@react/utils/status';
import { Flex, TableColumnsType } from 'antd';
import { ParamsOption } from 'apps/Internal/src/components/layouts/types';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { IApprovalInfo } from '../types';

export interface Props {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  dataTable: IApprovalInfo[]
}

const ModalProcess: React.FC<Props> = ({ isOpen, setIsOpen, dataTable }) => {
  const { APPROVAL_HISTORY_STEP_STATUS = [] } =
    useGetDataFromQueryKey<ParamsOption>([REACT_QUERY_KEYS.GET_PARAMS]);
  const handleCancel = () => {
    setIsOpen(false);
  };
  const columns: TableColumnsType<any> = [
    {
      title: 'STT',
      dataIndex: 'stt',
      width: 50,
      render: (_, __, idx: number) => {
        return <div>{idx + 1}</div>;
      },
    },
    {
      title: 'Người duyệt',
      dataIndex: 'approvedUserName',
      width: 130,
      render: (value: string) => {
        return <CTooltip title={value}>{value}</CTooltip>;
      },
    },
    {
      title: 'Trạng thái duyệt',
      dataIndex: 'status',
      width: 110,
      render: (value: number) => {
        const statusName = APPROVAL_HISTORY_STEP_STATUS.find(
          (e) => +e.value === value
        )?.label;
        return (
          <CTooltip title={statusName}>
            <CTag color={getCurrentStatusColor(value)}>{statusName}</CTag>
          </CTooltip>
        );
      },
    },
    {
      title: 'Ngày duyệt',
      dataIndex: 'approvedDate',
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
      title: 'Ghi chú',
      dataIndex: 'description',
      width: 120,
      render: (value: string) => {
        return <CTooltip title={value}>{value}</CTooltip>;
      },
    },
  ];
  return (
    <CModal
      title={'Tiến độ phê duyệt'}
      open={isOpen}
      loading={false}
      width={1000}
      onCancel={handleCancel}
      footer={[
        <Flex justify="end" className="w-full">
          <CButtonClose type="default" onClick={handleCancel}>
            Đóng
          </CButtonClose>
        </Flex>,
      ]}
    >
      <CTable
        columns={columns}
        dataSource={dataTable}
        pagination={false}
        scroll={{ y: 350 }}
      />
    </CModal>
  );
};

export default ModalProcess;
