/* eslint-disable no-prototype-builtins */

import {
  FieldErrorsType,
  IParamsRequest,
  MenuObjectItem,
} from '@react/commons/types';
import { FormInstance } from 'antd';
import { cloneDeep } from 'lodash';

export const flattenObject = (inputObj: { [key: string]: any }) => {
  const outputObj: { [key: string]: string } = {};

  for (const i in inputObj) {
    if (!inputObj.hasOwnProperty(i)) continue;

    if (typeof inputObj[i] === 'object') {
      const flatObject = flattenObject(inputObj[i]);
      for (const x in flatObject) {
        if (!flatObject.hasOwnProperty(x)) continue;

        outputObj[i + '.' + x] = flatObject[x];
      }
    } else {
      outputObj[i] = inputObj[i];
    }
  }
  return outputObj;
};

export const getParamsString = (data: object) => {
  const params = Object.fromEntries(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Object.entries(data).filter(
      ([_, value]) => value !== undefined || value === null || value === ''
    )
  );
  let stringParams = '';
  for (const property in params) {
    const value = (params as any)[property];
    const isArray = Array.isArray(value);
    if (value || value === 0) {
      if (isArray) {
        stringParams += `&${property}=${value.join(',')}`;
      } else {
        stringParams += `&${property}=${value}`;
      }
    }
  }
  return stringParams.slice(1);
};

export function base64ImageToBlob(str: string) {
  // extract content type and base64 payload from original string
  const pos = str.indexOf(';base64,');
  const type = str.substring(5, pos);
  const b64 = str.substr(pos + 8);

  // decode base64
  const imageContent = atob(b64);

  // create an ArrayBuffer and a view (as unsigned 8-bit)
  const buffer = new ArrayBuffer(imageContent.length);
  const view = new Uint8Array(buffer);

  // fill the view, using the decoded base64
  for (let n = 0; n < imageContent.length; n++) {
    view[n] = imageContent.charCodeAt(n);
  }

  // convert ArrayBuffer to Blob
  return new Blob([buffer], { type: type });
}

export const getUrlsActive = (menuItem: MenuObjectItem[]) => {
  return menuItem.map((item) => item.uri);
};

// Định nghĩa kiểu dữ liệu cho các trường
// Định nghĩa kiểu dữ liệu cho các trường
type BaseField = {
  name: string;
  type:
  | 'string'
  | 'number'
  | 'date'
  | 'boolean'
  | 'email'
  | 'array_string'
  | 'day';
};

type ArrayStringField = BaseField & {
  type: 'array_string';
  values: string[];
};
type NonArrayStringField = BaseField & {
  type: 'string' | 'number' | 'date' | 'boolean' | 'email' | 'day';
};
type Field = ArrayStringField | NonArrayStringField; // Định nghĩa kiểu dữ liệu cho bản ghi
export function convertVietnameseToEnglish(text: string) {
  const vowelMap = {
    á: 'as',
    à: 'af',
    ả: 'ar',
    ã: 'ax',
    ạ: 'aj',
    ấ: 'aas',
    ầ: 'aaf',
    ẩ: 'aar',
    ẫ: 'aax',
    ậ: 'aaj',
    é: 'es',
    è: 'ef',
    ẻ: 'er',
    ẽ: 'ex',
    ẹ: 'ej',
    ế: 'ees',
    ề: 'eef',
    ể: 'eer',
    ễ: 'eex',
    ệ: 'eej',
    í: 'is',
    ì: 'if',
    ỉ: 'ir',
    ĩ: 'ix',
    ị: 'ij',
    ó: 'os',
    ò: 'of',
    ỏ: 'or',
    õ: 'ox',
    ọ: 'oj',
    ố: 'oos',
    ồ: 'oof',
    ổ: 'oor',
    ỗ: 'oox',
    ộ: 'ooj',
    ớ: 'ows',
    ờ: 'owf',
    ở: 'owr',
    ỡ: 'owx',
    ợ: 'owj',
    ú: 'us',
    ù: 'uf',
    ủ: 'ur',
    ũ: 'ux',
    ụ: 'uj',
    ứ: 'uws',
    ừ: 'uwf',
    ử: 'uwr',
    ữ: 'uwx',
    ự: 'uwj',
    ý: 'ys',
    ỳ: 'yf',
    ỷ: 'yr',
    ỹ: 'yx',
    ỵ: 'yj',
    ê: 'ee',
    â: 'aa',
    ô: 'oo',
    ơ: 'ow',
    ư: 'uw',
    Á: 'As',
    À: 'Af',
    Ả: 'Ar',
    Ã: 'Ax',
    Ạ: 'Aj',
    Ấ: 'AAs',
    Ầ: 'AAf',
    Ẩ: 'AAr',
    Ẫ: 'AAx',
    Ậ: 'AAj',
    É: 'Es',
    È: 'Ef',
    Ẻ: 'Er',
    Ẽ: 'Ex',
    Ẹ: 'Ej',
    Ế: 'EEs',
    Ề: 'EEf',
    Ể: 'EEr',
    Ễ: 'EEx',
    Ệ: 'EEj',
    Í: 'Is',
    Ì: 'If',
    Ỉ: 'Ir',
    Ĩ: 'Ix',
    Ị: 'Ij',
    Ó: 'Os',
    Ò: 'Of',
    Ỏ: 'Or',
    Õ: 'Ox',
    Ọ: 'Oj',
    Ố: 'OOs',
    Ồ: 'OOf',
    Ổ: 'OOr',
    Ỗ: 'OOx',
    Ộ: 'OOj',
    Ớ: 'OWs',
    Ờ: 'OWf',
    Ở: 'OWr',
    Ỡ: 'OWx',
    Ợ: 'OWj',
    Ú: 'Us',
    Ù: 'Uf',
    Ủ: 'Ur',
    Ũ: 'Ux',
    Ụ: 'Uj',
    Ứ: 'UWs',
    Ừ: 'UWf',
    Ử: 'UWr',
    Ữ: 'UWx',
    Ự: 'UWj',
    Ý: 'Ys',
    Ỳ: 'Yf',
    Ỷ: 'Yr',
    Ỹ: 'Yx',
    Ỵ: 'Yj',
    Ê: 'EE',
    Â: 'AA',
    Ô: 'OO',
    Ơ: 'OW',
    Ư: 'UW',
    ă: 'aw',
  };

  let result = text;
  for (const [vietnameseChar, englishChar] of Object.entries(vowelMap)) {
    result = result.replace(new RegExp(vietnameseChar, 'g'), englishChar);
  }

  return result.replace(/đ/g, 'd').replace(/Đ/g, 'D');
}

export const removeVietNamese = (str: string) => {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
  str = str.replace(/Đ/g, 'D');
  return str;
};

const parseValue = (val: any) => {
  if (val === 'undefined') return undefined;
  if (val === 'null') return null;
  return val;
};

export const decodeSearchParams = (searchParams: any) => {
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
    page: params.page ? Number(params.page) : 0,
    size: params.size ? Number(params.size) : 20,
    status: params.status ? Number(params.status) : undefined,
  };
};

export const cleanParams = <T>(params: IParamsRequest) => {
  const values = Object.fromEntries(
    Object.entries(params).filter(
      ([_, value]) => value !== undefined && value !== '' && value !== null
    )
  );
  return values as T;
};

export const queryParams = <T>(payload: IParamsRequest) => {
  const params = cloneDeep(payload);
  delete params.filters;
  return cleanParams(params) as T;
};

export const formatCurrencyVND = (value: number | string): string => {
  const numberValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numberValue)) return '';
  return numberValue
    .toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
    .replace(/\./g, ',');
};

export const mapApiErrorToForm = (
  form: FormInstance,
  errors: FieldErrorsType[]
) => {
  if (errors?.length) {
    form.setFields(
      errors.map((item) => ({
        name: item.field,
        errors: [item.detail],
      }))
    );
  }
};
export const handleKeyDowNumber = (
  event: React.KeyboardEvent<HTMLInputElement>
) => {
  console.log(event.shiftKey, event.keyCode);

  // Cho phép các phím chức năng: Backspace (8), Tab (9), Enter (13), Delete (46), và các phím điều hướng
  if (
    event.keyCode === 8 || // Backspace
    event.keyCode === 9 || // Tab
    event.keyCode === 13 || // Enter
    event.keyCode === 46 || // Delete
    (event.keyCode >= 37 && event.keyCode <= 40) // Arrow keys (phím điều hướng)
  ) {
    return; // Cho phép các phím này
  }

  // Cho phép sao chép và dán (Ctrl + C, Ctrl + V, Ctrl + A)
  if (
    (event.ctrlKey || event.metaKey) &&
    ['a', 'c', 'v', 'x', 'A', 'C', 'V', 'X'].includes(event.key)
  ) {
    return; // Cho phép các thao tác sao chép/dán/chọn tất cả
  }
  if (
    (event.shiftKey || event.metaKey) &&
    (event.keyCode < 48 || event.keyCode > 57)
  ) {
    event.preventDefault(); // Ngăn nhập phím
    console.log('sdas');
    return;
  }
  // Chặn mọi phím không phải là số (0-9)
  if (event.keyCode < 48 || event.keyCode > 57) {
    event.preventDefault(); // Ngăn nhập phím
  }
};

export const handlePasteRemoveTextKeepNumber = (
  event: React.ClipboardEvent<HTMLInputElement>,
  maxLength: number
) => {
  event.preventDefault();
  const paste = event.clipboardData.getData('text');
  const onlyNumbers = paste.replace(/\D/g, '');
  const inputElement = event.currentTarget;
  const currentValue = inputElement.value;
  const selectionStart = inputElement.selectionStart ?? 0;
  const selectionEnd = inputElement.selectionEnd ?? 0;
  const beforeSelection = currentValue.substring(0, selectionStart);
  const afterSelection = currentValue.substring(selectionEnd);
  const remainingLength =
    maxLength - (beforeSelection.length + afterSelection.length);
  const truncatedValue = onlyNumbers.substring(0, remainingLength);
  inputElement.value = beforeSelection + truncatedValue + afterSelection;
  inputElement.setSelectionRange(
    beforeSelection.length + truncatedValue.length,
    beforeSelection.length + truncatedValue.length
  );
  return beforeSelection + truncatedValue + afterSelection;
};
const getNumericPosition = (formattedValue: string, caretPosition: number) => {
  let numericCount = 0;
  for (let i = 0; i < caretPosition; i++) {
    if (/\d/.test(formattedValue[i])) numericCount++;
  }
  return numericCount;
};
export const handlePasteNumberGroupsOfThree = (
  event: React.ClipboardEvent<HTMLInputElement>,
  maxLength: number,
  ref?: React.RefObject<HTMLInputElement>
) => {
  event.preventDefault();

  const paste = event.clipboardData.getData('text');
  const onlyNumbers = paste.replace(/\D/g, '');

  const inputElement = event.currentTarget;
  const rawCurrentValue = inputElement.value;
  const numericCurrentValue = rawCurrentValue.replace(/\D/g, '');

  const selectionStart = inputElement.selectionStart ?? 0;
  const selectionEnd = inputElement.selectionEnd ?? 0;

  const numericSelectionStart = getNumericPosition(
    rawCurrentValue,
    selectionStart
  );
  const numericSelectionEnd = getNumericPosition(rawCurrentValue, selectionEnd);

  const beforeSelection = numericCurrentValue.slice(0, numericSelectionStart);
  const afterSelection = numericCurrentValue.slice(numericSelectionEnd);

  const remainingLength =
    maxLength - (beforeSelection.length + afterSelection.length);
  const truncatedValue = onlyNumbers.slice(0, remainingLength);

  const newRawValue = beforeSelection + truncatedValue + afterSelection;

  const formattedValue = formatToGroupsOfThree(newRawValue);

  inputElement.value = formattedValue;

  const caretPositionNumeric = beforeSelection.length + truncatedValue.length;
  let caretPosition = 0;
  let numericCounter = 0;

  for (let i = 0; i < formattedValue.length; i++) {
    if (/\d/.test(formattedValue[i])) numericCounter++;
    if (numericCounter === caretPositionNumeric) {
      caretPosition = i + 1;
      break;
    }
  }
  inputElement.setSelectionRange(caretPosition, caretPosition);
  if (ref?.current) {
    ref.current.value = formattedValue;
  }
  return formattedValue;
};

const formatToGroupsOfThree = (value: string): string => {
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const handlePasteRemoveSpecialCharacters = (
  event: React.ClipboardEvent<HTMLInputElement>,
  maxLength: number,
  isUppercase?: boolean,
  isRemoveSpace?: boolean
) => {
  event.preventDefault();
  let paste = event.clipboardData.getData('text');
  const onlyNumbers = paste.replace(/[^a-zA-Z0-9\s]/g, '');
  if (isUppercase) {
    paste = onlyNumbers.toUpperCase();
  } else {
    paste = onlyNumbers;
  }
  if (isRemoveSpace) {
    paste = paste.replace(/\s+/g, '');
  }
  const inputElement = event.currentTarget;
  const currentValue = inputElement.value;
  const selectionStart = inputElement.selectionStart ?? 0;
  const selectionEnd = inputElement.selectionEnd ?? 0;
  const beforeSelection = currentValue.substring(0, selectionStart);
  const afterSelection = currentValue.substring(selectionEnd);
  const remainingLength =
    maxLength - (beforeSelection.length + afterSelection.length);
  const truncatedValue = paste.substring(0, remainingLength);
  inputElement.value = beforeSelection + truncatedValue + afterSelection;
  inputElement.setSelectionRange(
    beforeSelection.length + truncatedValue.length,
    beforeSelection.length + truncatedValue.length
  );
};

export const handlePasteRemoveSpace = (
  event: React.ClipboardEvent<HTMLInputElement>,
  maxLength: number
) => {
  event.preventDefault();
  const paste = event.clipboardData.getData('text');
  const withoutSpaces = paste.replace(/\s+/g, '');
  const inputElement = event.currentTarget;
  const currentValue = inputElement.value;

  const selectionStart = inputElement.selectionStart ?? 0;
  const selectionEnd = inputElement.selectionEnd ?? 0;

  const beforeSelection = currentValue.substring(0, selectionStart);
  const afterSelection = currentValue.substring(selectionEnd);

  const remainingLength = maxLength - currentValue.length;
  const truncatedValue = withoutSpaces.substring(0, remainingLength);

  inputElement.setSelectionRange(
    beforeSelection.length + truncatedValue.length,
    beforeSelection.length + truncatedValue.length
  );
  inputElement.value = beforeSelection + truncatedValue + afterSelection;
};

export const cleanUpString = (input: string) => {
  const trimmedString = input.trim();

  const cleanedString = trimmedString.replace(/\s\s+/g, ' ');

  return cleanedString;
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

const contentTypeJsonRegex = /application\/[^+]*[+]?(json);?.*/;

export const blobToJson = async <T>(blob: Blob): Promise<T> => {
  if (contentTypeJsonRegex.test(blob.type)) {
    const text = await blob.text();
    return JSON.parse(text) as T;
  } else {
    throw new Error('Response blob type is not JSON');
  }
};
