import { Text } from '@react/commons/Template/style';
import { TableColumnsType, Tooltip } from 'antd';
import { IKitListItem, IParamsListKit } from '../hooks/useKitList';
import { IOption } from 'apps/Internal/src/components/layouts/types';
import dayjs from 'dayjs';
import { formatDate, formatDateTime } from '@react/constants/moment';
import CTag from '@react/commons/Tag';
import { ColorList } from '@react/constants/color';

export enum ColorStatus {
  INACTIVE = '3',
  ACTIVE = '4',
}

export enum Color_Transfer_Status {
  IN_STOCK = '1',
  WAITING_APPROVED = '2',
}

const mappingColorTransferKitStatus = {
  [Color_Transfer_Status.IN_STOCK]: ColorList.CANCEL,
  [Color_Transfer_Status.WAITING_APPROVED]: ColorList.WAITING,
};

const mappingColorKitStatus = {
  [ColorStatus.ACTIVE]: ColorList.SUCCESS,
  [ColorStatus.INACTIVE]: ColorList.CANCEL,
};

export const columnsKitCraftList = (
  params: IParamsListKit,
  COMBINE_KIT_PROCESS_TYPE: IOption[],
  COMBINE_KIT_SIM_TYPE: IOption[],
  COMBINE_KIT_KIT_STATUS: IOption[],
  COMBINE_KIT_ISDN_TYPE: IOption[],
  STOCK_PRODUCT_SERIAL_STATUS: IOption[]
): TableColumnsType<IKitListItem> => {
  return [
    {
      title: 'STT',
      align: 'left',
      width: 50,
      fixed: 'left',
      render(_, __, index) {
        return <Text>{index + 1 + params.page * params.size}</Text>;
      },
    },
    {
      title: 'Serial SIM',
      dataIndex: 'serial',
      width: 160,
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
      dataIndex: 'isdn',
      width: 130,
      render(value) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Sản phẩm',
      dataIndex: 'productName',
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
      title: 'Kho SP SIM',
      dataIndex: 'stockSerialName',
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
      title: 'Kho SP số',
      dataIndex: 'stockIsdnName',
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
      title: 'Kiểu đấu KIT',
      dataIndex: 'processType',
      width: 120,
      render(value) {
        const text =
          COMBINE_KIT_PROCESS_TYPE.find((item) => item.value == value)?.label ??
          '';
        return (
          <Tooltip title={text} placement="topLeft">
            <Text>{text}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Đơn vị sở hữu',
      dataIndex: 'ownerName',
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
      title: 'Loại thuê bao',
      dataIndex: 'isdnType',
      width: 110,
      render(value) {
        const text =
          COMBINE_KIT_ISDN_TYPE.find((item) => item.value == value)?.label ??
          '';
        return (
          <Tooltip title={text} placement="topLeft">
            <Text>{text}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Gói cước chính',
      dataIndex: 'packageProfileName',
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
      title: 'Gói cước đệm',
      dataIndex: 'bufferPackageName',
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
      title: 'Loại profile',
      dataIndex: 'profileType',
      width: 110,
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
      width: 110,
      render(value) {
        const text =
          COMBINE_KIT_SIM_TYPE.find((item) => item.value == value)?.label ?? '';
        return (
          <Tooltip title={text} placement="topLeft">
            <Text>{text}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Trạng thái kit',
      dataIndex: 'status',
      width: 150,
      render(value: ColorStatus) {
        const kitCraftStatus = COMBINE_KIT_KIT_STATUS.find(
          (item) => item.value == value
        );
        const text = kitCraftStatus ? kitCraftStatus.label : '';
        const color = kitCraftStatus
          ? mappingColorKitStatus[
              kitCraftStatus.value as keyof typeof mappingColorKitStatus
            ]
          : ColorList.DEFAULT;
        return (
          <Tooltip title={text} placement="topLeft">
            <CTag bordered={false} color={color}>
              {text}
            </CTag>
          </Tooltip>
        );
      },
    },
    {
      title: 'Trạng thái phân phối',
      dataIndex: 'transferStatus',
      width: 180,
      render(value: Color_Transfer_Status) {
        const kitCraftStatus = STOCK_PRODUCT_SERIAL_STATUS.find(
          (item) => item.value == value
        );
        const text = kitCraftStatus ? kitCraftStatus.label : '';
        const color = kitCraftStatus
          ? mappingColorTransferKitStatus[
              kitCraftStatus.value as keyof typeof mappingColorTransferKitStatus
            ]
          : ColorList.DEFAULT;
        return (
          <Tooltip title={text} placement="topLeft">
            <CTag bordered={false} color={color}>
              {text}
            </CTag>
          </Tooltip>
        );
      },
    },
    {
      title: 'Ngày ghép KIT',
      dataIndex: 'createdDate',
      width: 150,
      render(value) {
        const text = value ? dayjs(value).format(formatDate) : '';
        const tooltip = value ? dayjs(value).format(formatDateTime) : '';
        return (
          <Tooltip title={tooltip} placement="topLeft">
            <Text>{text}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Người ghép KIT',
      dataIndex: 'createdBy',
      width: 200,
      render(value) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
  ];
};
