import { ActionsTypeEnum, ActionType } from '../constants/app';
import { ACTION_MODE_ENUM, AnyElement } from '@react/commons/types';

import {
  getDateFilter,
  getInputFilter,
  getSelectFilter,
} from './FilterType';
import { FilterReturnType, FilterTableProps } from './FilterType/type';
export const getActionMode = (value: string | undefined) => {
  switch (value) {
    case ACTION_MODE_ENUM.CREATE:
      return 'Tạo';
    case ACTION_MODE_ENUM.EDIT:
      return 'Chỉnh sửa';
    case ACTION_MODE_ENUM.VIEW:
      return 'Chi tiết';
    default:
      return '';
  }
};
export const subPageTitle = (actionType: string) => {
  switch (actionType) {
    case ActionType.ADD:
      return 'Tạo';
    case ActionType.VIEW:
      return 'Xem chi tiết';
    case ActionType.EDIT:
      return 'Chỉnh sửa';
    case ActionsTypeEnum.COPY:
      return 'Sao chép';
    default:
      return '';
  }
};

export const filterFalsy = (obj: any, ejectKeys?: string[]) => {
  return Object.keys(obj).reduce((acc, key) => {
    if (obj[key] || (ejectKeys ?? []).includes(key)) {
      (acc as any)[key] = obj[key];
    }
    return acc;
  }, {});
};

export const getFilter = <
  T extends Record<string, unknown>,
  K extends AnyElement,
>(
  props: FilterTableProps<K>,
): FilterReturnType<T> => {
  switch (props.type) {
    case 'Input':
      return getInputFilter(props);
    case 'Select':
      return getSelectFilter(props);
    case 'Date':
      return getDateFilter(props);
    default:
      return {};
  }
};
