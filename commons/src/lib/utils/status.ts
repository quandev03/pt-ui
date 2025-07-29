import { ColorList } from '@react/constants/color';
import {
  CurrentStatusList,
  DiscountList,
  DeliveryOrderStatusList,
  DistributionStatusList,
  KitCraftStatusList,
  LastStatusList,
  SimStatusList,
} from '@react/constants/status';

export const getCurrentStatusColor = (code: number, isHexCode?: boolean) => {
  switch (code) {
    case CurrentStatusList.PENDING:
      return !isHexCode ? 'warning' : '#fec76f';
    case CurrentStatusList.APPROVED:
      return !isHexCode ? 'success' : '#87d068';
    case CurrentStatusList.REFUSE:
      return !isHexCode ? 'error' : '#ce8189';
    default:
      return !isHexCode ? 'default' : '#d6d6d6';
  }
};

export const getLastStatusColor = (code: number) => {
  switch (code) {
    case LastStatusList.PENDING:
      return 'warning';
    case LastStatusList.APPROVING:
      return 'processing';
    case LastStatusList.APPROVED:
      return 'success';
    case LastStatusList.REFUSE:
      return 'error';
    case LastStatusList.CANCEL:
      return 'error';
    default:
      return 'default';
  }
};

export const getKitCraftStatusColor = (code: number, isHexCode?: boolean) => {
  switch (code) {
    case KitCraftStatusList.PROGRESS:
      return !isHexCode ? 'processing' : '#fec76f';
    case KitCraftStatusList.COMPLETE:
      return !isHexCode ? 'success' : '#87d068';
    case KitCraftStatusList.UN_IMPLEMENTED:
      return !isHexCode ? 'warning' : '#ce8189';
    case KitCraftStatusList.FAIL:
      return !isHexCode ? 'error' : '#ce8189';
    default:
      return !isHexCode ? 'default' : '#d6d6d6';
  }
};

export const getDeliveryOrderStatusColor = (code: number) => {
  switch (code) {
    case DeliveryOrderStatusList.CREATE:
      return 'default';
    case DeliveryOrderStatusList.VOTING:
      return 'warning';
    case DeliveryOrderStatusList.PROGRESS:
      return 'processing';
    case DeliveryOrderStatusList.COMPLETE:
      return 'success';
    case DeliveryOrderStatusList.CANCEL:
      return 'error';
    default:
      return 'default';
  }
};

export const getDeliveryNoterStatusColor = (code: number) => {
  switch (code) {
    case CurrentStatusList.PENDING:
      return ColorList.DEFAULT;
    case CurrentStatusList.APPROVED:
      return ColorList.SUCCESS;
    case CurrentStatusList.REFUSE:
      return ColorList.FAIL;
    default:
      return ColorList.DEFAULT;
  }
};

export const getSimStatusColor = (code: number, isHexCode?: boolean) => {
  switch (code) {
    case SimStatusList.KIT_PAIRED:
      return !isHexCode ? 'processing' : '#fec76f';
    case SimStatusList.WAIT_KIT_PAIRED:
      return !isHexCode ? 'warning' : '#fec76f';
    case SimStatusList.ACTIVAED:
      return !isHexCode ? 'success' : '#87d068';
    case SimStatusList.NOT_USED:
      return !isHexCode ? 'default' : '#ce8189';
    default:
      return !isHexCode ? 'warning' : '#d6d6d6';
  }
};

export const getDistributionStatusColor = (
  code: number,
  isHexCode?: boolean
) => {
  switch (code) {
    case DistributionStatusList.BUILD:
      return !isHexCode ? 'success' : '#87d068';
    case DistributionStatusList.IN_STOCK:
      return !isHexCode ? 'processing' : '#fec76f';
    default:
      return !isHexCode ? 'default' : '#d6d6d6';
  }
};

export const getDiscountColor = (code: number, isHexCode?: boolean) => {
  switch (code) {
    case DiscountList.PENDING:
      return 'warning';
    case DiscountList.APPROVING:
      return 'processing';
    case DiscountList.APPROVED:
      return 'success';
    case DiscountList.REFUSE:
      return 'error';
    default:
      return 'default';
  }
};
