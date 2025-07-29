import { FormOutlined, SaveOutlined } from '@ant-design/icons';
import CInputNumber from '@react/commons/InputNumber';
import CSwitch from '@react/commons/Switch';
import { Text } from '@react/commons/Template/style';
import { formatTimeHHmm } from '@react/constants/moment';
import { MESSAGE } from '@react/utils/message';
import { Flex, Form, TimePicker, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import ModalConfirm from 'apps/Internal/src/components/modalConfirm';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { useEffect, useState } from 'react';
import { useEditQuantity } from '../hooks/useEditQuantity';
import { useEditStatus } from '../hooks/useEditStatus';
import { useActivationConfigList } from '../hooks/useList';
import { StyledTable } from '../pages/styled';
import { IConfigItem } from '../types';
import { CHANNEL_LABELS, isChannelActive, isChannelAvailable, getAvailableChannels } from '../utils/channelUtils';
import dayjs from 'dayjs';

const ActicationConfig = () => {
  const [form] = Form.useForm();
  const [editableRows, setEditableRows] = useState<{ [key: string]: boolean }>(
    {}
  );
  const messageOn = 'Bạn có chắc muốn bật nội dung cấu hình không?';
  const messageOff = 'Bạn có chắc muốn tắt nội dung cấu hình không?';
  const { data, isPending: loadingTable } = useActivationConfigList();
  const { mutate: editLimit, isPending: loadingEditLimit } = useEditQuantity(
    () => setEditableRows({})
  );
  const { mutate: editStatus, isPending: loadingEditStatus } = useEditStatus(
    REACT_QUERY_KEYS.GET_ACTIVATION_CONFIG_LIST
  );
  const timeRangeCode = 'SUBSCRIBER_ACTIVE_TIME';

  const availableChannels = data ? getAvailableChannels(data) : [];

  useEffect(() => {
    if (data) {
      data.forEach((item) => {
        if (item.code === timeRangeCode) {
          const timeString = item.value;
          const [startTime, endTime] = timeString
            .split('~')
            .map((time) => dayjs(time, 'HH:mm'));
          form.setFieldValue(['time', item.id], [startTime, endTime]);
        } else {
          form.setFieldValue(['quantity', item.id], item.value);
        }
      });
    }
  }, [data]);

  const handleClickEdit = (key: number) => {
    setEditableRows((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const handleFinish = (record: IConfigItem) => {
    const isErr = form.getFieldError(['quantity', record.id]).length > 0;
    if (isErr) {
      return;
    }
    ModalConfirm({
      message: MESSAGE.G04,
      handleConfirm() {
        if (record.code === timeRangeCode) {
          const [start, end] = form.getFieldValue(['time', record.id]);
          const payload =
            start.format(formatTimeHHmm) + '~' + end.format(formatTimeHHmm);
          editLimit({
            id: record.id,
            value: payload,
          });
        } else {
          editLimit({
            id: record.id,
            value: form.getFieldValue(['quantity', record.id]),
          });
        }
      },
      handleCancel() {
        setEditableRows({});
      },
    });
  };

  const handleChannelChange = (record: IConfigItem, channel: string) => {
    const isCurrentlyActive = isChannelActive(record.activeChannel, channel);
    ModalConfirm({
      message: isCurrentlyActive ? messageOff : messageOn,
      handleConfirm() {
        editStatus({ id: record.id, channel });
      },
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      !(
        (event.key >= '0' && event.key <= '9') ||
        event.key === 'Backspace' ||
        event.key === 'Delete' ||
        event.key === 'ArrowLeft' ||
        event.key === 'ArrowRight' ||
        event.key === 'Tab'
      )
    ) {
      event.preventDefault();
    }
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
      title: 'Nội dung cấu hình',
      dataIndex: 'name',
      align: 'left',
      width: 280,
      render(value) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Số lượng',
      dataIndex: 'value',
      align: 'left',
      width: 240,
      render(_, record) {
        const isEditable = editableRows[record.id] || false;
        const renderedItem = () => {
          if (
            record.code === 'SUB_FREQUENCY' ||
            record.code === 'MAX_SUBSCRIBER_BY_USER'
          ) {
            return (
              <Form.Item
                name={['quantity', record.id]}
                rules={[
                  {
                    required: true,
                    message: MESSAGE.G06,
                  },
                ]}
                className="mb-0"
              >
                <CInputNumber
                  style={{ width: '185px' }}
                  min={1}
                  maxLength={10}
                  disabled={!isEditable}
                  onKeyDown={handleKeyDown}
                />
              </Form.Item>
            );
          } else if (record.code === timeRangeCode) {
            return (
              <Form.Item
                name={['time', record.id]}
                rules={[
                  {
                    required: true,
                    message: MESSAGE.G06,
                  },
                ]}
                className="mb-0"
              >
                <TimePicker.RangePicker
                  format={formatTimeHHmm}
                  disabled={!isEditable}
                  needConfirm={false}
                  allowClear={false}
                />
              </Form.Item>
            );
          }
        };
        return record.code === 'SUB_FREQUENCY' ||
          record.code === 'MAX_SUBSCRIBER_BY_USER' ||
          record.code === timeRangeCode ? (
          <Flex gap={10}>
            <Form form={form}>{renderedItem()}</Form>
            {!isEditable && (
              <FormOutlined
                className="text-xl text-slate-800 cursor-pointer"
                onClick={() => handleClickEdit(record.id)}
              />
            )}
            {isEditable && (
              <SaveOutlined
                className="text-xl text-slate-800 cursor-pointer"
                onClick={() => handleFinish(record)}
              />
            )}
          </Flex>
        ) : null;
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
      <strong className="text-[15px]">Quản lý cấu hình kích hoạt</strong>
      <StyledTable
        className="mt-3 pb-5"
        columns={columns}
        dataSource={data}
        rowKey={'id'}
        loading={loadingEditLimit || loadingEditStatus || loadingTable}
        size="middle"
      />
    </>
  );
};
export default ActicationConfig;
