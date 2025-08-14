import { ColumnsType } from 'antd/es/table';
import { IEsimWarehouseList } from '../types';
import { useSearchParams } from 'react-router-dom';
import {
  decodeSearchParams,
  IModeAction,
  RenderCell,
  usePermissions,
  Text,
  WrapperActionTable,
  CButton,
  CTag,
  TypeTagEnum,
  formatDate,
} from '@vissoft-react/common';
import useConfigAppStore from '../../Layouts/stores';
import { Dropdown } from 'antd';
import { MoreVertical } from 'lucide-react';
import dayjs from 'dayjs';
import {
  ActiveStatusEnum,
  activeStatusMap,
  Status900Enum,
  status900Map,
} from '../constants/enum';

interface useColumnsEsimWarehouseListProps {
  onGenQr: (record: IEsimWarehouseList) => void;
  onSendQr: (record: IEsimWarehouseList) => void;
  onViewDetails: (record: IEsimWarehouseList) => void;
}

export const useColumnsEsimWarehouseList = ({
  onGenQr,
  onSendQr,
  onViewDetails,
}: useColumnsEsimWarehouseListProps): ColumnsType<IEsimWarehouseList> => {
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { menuData } = useConfigAppStore();
  const permission = usePermissions(menuData);

  return [
    {
      title: 'STT',
      align: 'left',
      width: 50,
      fixed: 'left',
      render(_, record, index) {
        return (
          <RenderCell
            value={index + 1 + params.page * params.size}
            tooltip={index + 1 + params.page * params.size}
          />
        );
      },
    },
    {
      title: 'Số thuê bao',
      dataIndex: 'isdn',
      width: 150,
      align: 'left',
      fixed: 'left',
      render(value, record) {
        return <RenderCell value={value} tooltip={value} />;
      },
    },
    {
      title: 'Serial SIM',
      dataIndex: 'serial',
      width: 200,
      align: 'left',
      fixed: 'left',
      render(value, record) {
        return <RenderCell value={value} tooltip={value} />;
      },
    },
    {
      title: 'Gói cước',
      dataIndex: 'packCode',
      width: 150,
      align: 'left',
      render(value, record) {
        return <RenderCell value={value} tooltip={value} />;
      },
    },
    {
      title: 'Mã đơn hàng',
      dataIndex: 'orderNo',
      width: 200,
      render(value, record) {
        return <RenderCell value={value} tooltip={value} />;
      },
    },
    {
      title: 'Đại lý',
      dataIndex: 'orgName',
      width: 150,
      align: 'left',
      render(value, record) {
        return <RenderCell value={value} tooltip={value} />;
      },
    },
    {
      title: 'Trạng thái thuê bao',
      dataIndex: 'status900',
      width: 200,
      align: 'left',
      render(value: Status900Enum, record) {
        const { text, type, color, textColor, fontWeight } = status900Map[
          value
        ] || {
          text: 'Không rõ',
          type: TypeTagEnum.DEFAULT,
          color: '#808080',
          textColor: '#FFFFFF',
          fontWeight: 'normal',
        };
        return (
          <CTag color={color} type={type}>
            {/* [FIX] Pass a styled <span> as the value to RenderCell */}
            <RenderCell
              value={
                <span style={{ color: textColor, fontWeight: fontWeight }}>
                  {text}
                </span>
              }
              tooltip={text} // Tooltip should remain a plain string for best performance
            />
          </CTag>
        );
      },
    },
    {
      title: 'Trạng thái chặn cắt',
      dataIndex: 'activeStatus',
      width: 200,
      align: 'left',
      render(value: ActiveStatusEnum, record) {
        const { text, type, color, textColor, fontWeight } = activeStatusMap[
          value
        ] || {
          text: 'Không rõ',
          type: TypeTagEnum.DEFAULT,
          color: '#808080',
          textColor: '#FFFFFF',
          fontWeight: 'normal',
        };
        return (
          <CTag color={color} type={type}>
            {/* [FIX] Pass a styled <span> as the value to RenderCell */}
            <RenderCell
              value={
                <span style={{ color: textColor, fontWeight: fontWeight }}>
                  {text}
                </span>
              }
              tooltip={text}
            />
          </CTag>
        );
      },
    },
    {
      title: 'Người gen QR',
      dataIndex: 'genQrBy',
      width: 200,
      align: 'left',
      render(value, record) {
        return <RenderCell value={value} tooltip={value} />;
      },
    },
    {
      title: 'Thời gian cập nhật',
      dataIndex: 'modifiedDate',
      width: 150,
      align: 'left',
      render(value, record) {
        return (
          <RenderCell value={dayjs(value).format(formatDate)} tooltip={value} />
        );
      },
    },
    {
      title: 'Hành động',
      align: 'center',
      width: 150,
      fixed: 'right',
      render(_, record) {
        const items = [
          {
            key: IModeAction.UPDATE,
            onClick: () => onSendQr(record),
            label: <Text>Gửi QR</Text>,
          },
          {
            key: IModeAction.READ,
            onClick: () => onViewDetails(record),
            label: <Text>Xem chi tiết eSIM</Text>,
          },
        ].filter((item) => permission.getAllPermissions().includes(item.key));

        return (
          <WrapperActionTable>
            <CButton type="default" onClick={() => onGenQr(record)}>
              Gen QR
            </CButton>
            <div className="w-5">
              <Dropdown
                menu={{ items: items }}
                placement="bottom"
                trigger={['click']}
              >
                <MoreVertical size={16} />
              </Dropdown>
            </div>
          </WrapperActionTable>
        );
      },
    },
  ];
};
