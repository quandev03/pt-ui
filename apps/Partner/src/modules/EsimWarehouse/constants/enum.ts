import { TypeTagEnum } from '@vissoft-react/common';

export enum ActiveStatusEnum {
  NORMAL = 1,
  ONE_WAY_CALL_BLOCK_BY_REQUEST = 10,
  ONE_WAY_CALL_BLOCK_BY_PROVIDER = 11,
  TWO_WAY_CALL_BLOCK_BY_REQUEST = 20,
  TWO_WAY_CALL_BLOCK_BY_PROVIDER = 21,
}

export enum Status900Enum {
  CALLED = 1,
  NOT_CALLED = 0,
}

// Map for ActiveStatusEnum to display text, type, and color
export const activeStatusMap: Record<
  ActiveStatusEnum,
  { text: string; type: TypeTagEnum; color: string }
> = {
  [ActiveStatusEnum.NORMAL]: {
    text: 'Bình thường',
    type: TypeTagEnum.DEFAULT,
    color: '#00B75F',
  },
  [ActiveStatusEnum.ONE_WAY_CALL_BLOCK_BY_REQUEST]: {
    text: 'Chặn 1C do yêu cầu',
    type: TypeTagEnum.DEFAULT,
    color: '#C5254294',
  },
  [ActiveStatusEnum.ONE_WAY_CALL_BLOCK_BY_PROVIDER]: {
    text: 'Chặn 1C do nhà mạng',
    type: TypeTagEnum.DEFAULT,
    color: '#C5254294',
  },
  [ActiveStatusEnum.TWO_WAY_CALL_BLOCK_BY_REQUEST]: {
    text: 'Chặn 2C do yêu cầu',
    type: TypeTagEnum.DEFAULT,
    color: '#6127A3',
  },
  [ActiveStatusEnum.TWO_WAY_CALL_BLOCK_BY_PROVIDER]: {
    text: 'Chặn 2C do nhà mạng',
    type: TypeTagEnum.DEFAULT,
    color: '#6127A3',
  },
};

// Map for Status900Enum to display text, type, and color
export const status900Map: Record<
  Status900Enum,
  { text: string; type: TypeTagEnum; color: string }
> = {
  [Status900Enum.CALLED]: {
    text: 'Đã gọi 900',
    type: TypeTagEnum.DEFAULT,
    color: '#00B75F',
  },
  [Status900Enum.NOT_CALLED]: {
    text: 'Chưa gọi 900',
    type: TypeTagEnum.DEFAULT,
    color: '#C5254294',
  },
};
