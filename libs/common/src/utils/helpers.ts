import { GetProp } from 'antd';
import { UploadProps } from 'antd/lib';
import { cloneDeep } from 'lodash';
import { AnyElement, IModeAction, IParamsRequest } from '../types';
import { parseValue } from './utils';
export type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

export const cleanParams = <T>(params: IParamsRequest) => {
  const values = Object.fromEntries(
    Object.entries(params).filter(([key, value]) => {
      return (
        value !== undefined &&
        value !== '' &&
        value !== null &&
        key !== 'filters'
      );
    })
  );
  return values as T;
};

export const formatQueryParams = <T>(payload: IParamsRequest) => {
  const params = cloneDeep(payload);
  delete params.filters;
  return cleanParams<T>(params);
};

export const decodeSearchParams = (
  searchParams: Record<string, AnyElement>
) => {
  const params = [...searchParams.entries()].reduce((acc, [key, val]) => {
    try {
      return {
        ...acc,
        [key]: parseValue(val),
      };
    } catch {
      return {
        ...acc,
        [key]: val,
      };
    }
  }, {});
  return {
    ...params,
    page: params.page ? params.page.toString() : '0',
    size: params.size ? params.size.toString() : '20',
    status: params.status ? params.status.toString() : '',
  };
};

export const formatCurrencyVND = (value: number | string): string => {
  const numberValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numberValue)) return '';
  return numberValue.toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

export const cleanUpPhoneNumber = (input: string) => {
  const trimmedString = input.trim();

  const cleanedString = trimmedString.replace(/\s\s+/g, '');

  return cleanedString;
};

export const formatBytes = (bytes: number) => {
  const units = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  let index = 0;

  while (bytes >= 1024 && index < units.length - 1) {
    bytes /= 1024;
    index++;
  }

  return `${bytes.toFixed(2)} ${units[index]}`;
};

export const filterFalsy = (
  obj: Record<string, AnyElement>,
  ejectKeys?: string[]
) => {
  return Object.keys(obj).reduce((acc, key) => {
    if (obj[key] || (ejectKeys ?? []).includes(key)) {
      (acc as Record<string, AnyElement>)[key] = obj[key];
    }
    return acc;
  }, {});
};

export const normFile = (e: AnyElement) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

export const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export const checkIfImage = async (url: string): Promise<boolean> => {
  const regex = /\.(jpeg|jpg|gif|png|webp|bmp|svg)$/i; //Check đuôi có phải ảnh không

  console.log('!regex ', !regex.test(url.split('?')[0]));
  if (!regex.test(url.split('?')[0])) {
    return false;
  }

  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
};
export const getActionMode = (value: string | undefined) => {
  switch (value) {
    case IModeAction.CREATE:
      return 'Thêm mới';
    case IModeAction.UPDATE:
      return 'Chỉnh sửa';
    case IModeAction.READ:
      return 'Chi tiết';
    default:
      return '';
  }
};
