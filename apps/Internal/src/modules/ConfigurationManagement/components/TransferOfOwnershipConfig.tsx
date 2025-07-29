import CSwitch from '@react/commons/Switch';
import CTable from '@react/commons/Table';
import { Text } from '@react/commons/Template/style';
import { Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import ModalConfirm from 'apps/Internal/src/components/modalConfirm';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { useEditStatus } from '../hooks/useEditStatus';
import { useTransferOfOwnershipConfigList } from '../hooks/useList';
import { IConfigItem } from '../types';
import { CHANNEL_LABELS, isChannelActive, isChannelAvailable, getAvailableChannels } from '../utils/channelUtils';

const TransferOfOwnershipConfig = () => {
  const { data: dataTable } = useTransferOfOwnershipConfigList();
  const messageOn = 'Bạn có chắc muốn bật nội dung cấu hình không?';
  const messageOff = 'Bạn có chắc muốn tắt nội dung cấu hình không?';
  const { mutate: editStatus } = useEditStatus(
    REACT_QUERY_KEYS.GET_TRANSFER_OF_OWNERSHIP_CONFIG_LIST
  );

  const availableChannels = dataTable ? getAvailableChannels(dataTable) : [];

  const handleChannelChange = (record: IConfigItem, channel: string) => {
    const isCurrentlyActive = isChannelActive(record.activeChannel, channel);
    ModalConfirm({
      message: isCurrentlyActive ? messageOff : messageOn,
      handleConfirm() {
        editStatus({ id: record.id, channel });
      },
    });
  };

  const columns: ColumnsType<IConfigItem> = [
    {
      title: 'STT',
      align: 'left',
      fixed: 'left',
      width: 70,
      render(_, __, index) {
        return <Text>{index + 1}</Text>;
      },
    },
    {
      title: 'Nội dung tiêu chí',
      dataIndex: 'name',
      align: 'left',
      width: 520,
      render(value) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    ...availableChannels.map((channel) => ({
      title: CHANNEL_LABELS[channel as keyof typeof CHANNEL_LABELS] || channel,
      dataIndex: 'activeChannel',
      align: 'center' as const,
      width: 130,
      render: (activeChannel: string, record: IConfigItem) => {
        if (!isChannelAvailable(record, channel)) {
          return <Text></Text>;
        }
        
        return (
          <Tooltip 
            title={isChannelActive(activeChannel, channel) ? 'Bật' : 'Tắt'} 
            placement="topLeft"
          >
            <CSwitch
              value={isChannelActive(activeChannel, channel)}
              onChange={() => handleChannelChange(record, channel)}
            />
          </Tooltip>
        );
      },
    }))
  ];
  
  return (
    <>
      <strong className="text-[15px]">Quản lý cấu hình chuyển chủ quyền</strong>
      <CTable 
        className="mt-3 pb-7" 
        columns={columns} 
        dataSource={dataTable}
        size="middle"
      />
    </>
  );
};
export default TransferOfOwnershipConfig;
