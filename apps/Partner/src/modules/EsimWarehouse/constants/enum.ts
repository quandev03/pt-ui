import { ColorList, TypeTagEnum } from '@vissoft-react/common';

export enum ActiveStatusEnum {
  NORMAL = 1,
  ONE_WAY_CALL_BLOCK_BY_REQUEST = 10,
}

export enum Status900Enum {
  IN_STORE = 0,
  SOLD = 1,
  CALLED = 2,
  INFO_UPDATED = 3,
}

// Map for ActiveStatusEnum to display text, type, color, and font weight
export const activeStatusMap: Record<
  ActiveStatusEnum,
  {
    text: string;
    type: TypeTagEnum;
    color: string;
    textColor: string;
    fontWeight: string;
  }
> = {
  [ActiveStatusEnum.NORMAL]: {
    text: 'Bình thường',
    type: TypeTagEnum.DEFAULT,
    color: ColorList.SUCCESS,
    textColor: '#00CC00',
    fontWeight: 'bold',
  },
  [ActiveStatusEnum.ONE_WAY_CALL_BLOCK_BY_REQUEST]: {
    text: 'Chặn 1C',
    type: TypeTagEnum.DEFAULT,
    color: '#C5254294', // Background color (semi-transparent red)
    textColor: '#9B1A32', // Darker, opaque red for text
    fontWeight: 'bold',
  },
};

// Map for Status900Enum to display text, type, color, and font weight
export const status900Map: Record<
  Status900Enum,
  {
    text: string;
    type: TypeTagEnum;
    color: string;
    textColor: string;
    fontWeight: string;
  }
> = {
  [Status900Enum.SOLD]: {
    text: 'Đã bán',
    type: TypeTagEnum.DEFAULT,
    color: ColorList.SUCCESS,
    textColor: '#00CC00',
    fontWeight: 'bold',
  },
  [Status900Enum.IN_STORE]: {
    text: 'Trong kho',
    type: TypeTagEnum.DEFAULT,
    color: '#FFAC0026',
    textColor: '#FFAC00',
    fontWeight: 'bold',
  },
  [Status900Enum.CALLED]: {
    text: 'Đã gọi 900',
    type: TypeTagEnum.DEFAULT,
    color: '#F0E2FF',
    textColor: '#9E3DFF',
    fontWeight: 'bold',
  },
  [Status900Enum.INFO_UPDATED]: {
    text: 'Đã cập nhật TTTB',
    type: TypeTagEnum.DEFAULT,
    color: '#D9E6F2',
    textColor: '#005AAA',
    fontWeight: 'bold',
  },
};

export const GENDER_MAP: { [key: number]: string } = {
  0: 'Nam',
  1: 'Nữ',
};
