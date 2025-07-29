import dayjs, { Dayjs } from 'dayjs';
import {
  AttributeType,
  ICoverageRangesData,
  ProductCatalog,
  ProductDTOS,
} from '../types';
import { DateFormat } from '@react/constants/app';
import { DefaultOptionType } from 'antd/es/select';
import { ServicePackageItem } from '../../ListOfServicePackage/types';

const range = (start: number, end: number) => {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
};

export const disabledFromDate = (current: Dayjs, toDate: Dayjs) => {
  return toDate && current.isAfter(toDate, 'D');
};

export const disabledFromTime = (current: Dayjs, toDate: Dayjs) => {
  if (toDate && current.isSame(toDate, 'D')) {
    return {
      disabledHours: () =>
        range(0, 24).splice(toDate.get('h') + 1, 24 - toDate.get('h')),
      disabledMinutes: () =>
        current.isSame(toDate, 'h')
          ? range(0, 60).splice(toDate.get('m'), 60 - toDate.get('m'))
          : [],
    };
  }

  return {};
};

export const disabledToDate = (
  current: Dayjs,
  fromDate: Dayjs,
  toDateAfter: Dayjs
) => {
  return (
    current.isBefore(fromDate, 'D') ||
    (toDateAfter && current.isAfter(toDateAfter, 'D'))
  );
};

export const disabledToTime = (
  current: Dayjs,
  fromDate: Dayjs,
  toDateAfter: Dayjs
) => {
  if (fromDate && current.isSame(fromDate, 'D')) {
    return {
      disabledHours: () => range(0, 24).splice(0, fromDate.get('h')),
      disabledMinutes: () =>
        current.isSame(fromDate, 'h')
          ? range(0, 60).splice(0, fromDate.get('m') + 1)
          : [],
    };
  }

  if (toDateAfter && current.isSame(toDateAfter, 'D')) {
    return {
      disabledHours: () =>
        range(0, 24).splice(
          toDateAfter.get('h') + 1,
          24 - toDateAfter.get('h')
        ),
      disabledMinutes: () =>
        current.isSame(toDateAfter, 'h')
          ? range(0, 60).splice(toDateAfter.get('m'), 60 - toDateAfter.get('m'))
          : [],
    };
  }

  return {};
};

export const mapProductDTOStoView = (data: ProductDTOS[]) => {
  return data?.map((item) => ({
    id: item.id,
    price: item.price,
    fromDate: item.fromDate
      ? dayjs(item.fromDate, DateFormat.DATE_TIME_NO_SECOND)
      : undefined,
    toDate: item.toDate
      ? dayjs(item.toDate, DateFormat.DATE_TIME_NO_SECOND)
      : undefined,
  }));
};

export const mapProductDTOStoAdd = (data: ProductDTOS[]) => {
  return data?.map((item) => ({
    ...item,
    id: item.id ?? null,
    fromDate: item.fromDate
      ? dayjs(item.fromDate).format(DateFormat.DATE_TIME)
      : null,
    toDate: item.toDate
      ? dayjs(item.toDate).format(DateFormat.DATE_TIME)
      : null,
  }));
};

export const mapProductGroups = (
  products: ProductCatalog[]
): DefaultOptionType[] => {
  return products?.map((item) => ({
    title: item.productName,
    value: item.id,
    children: mapProductGroups(item.children),
  }));
};

export const mapAttributeValueByType = (
  attrType: AttributeType,
  dynamicData: any[],
  packageDataMain: ServicePackageItem[],
  packageDataSub:ServicePackageItem[],
  simData: any[],
  coverageRangesData: {
    label: string;
    value: string;
  }[],
) => {
  let attributeValues:
    | { id: string | null; label: string; value: string }[]
    | string;

  if (attrType === AttributeType.DYNAMIC) {
    attributeValues = dynamicData?.map((pcavDTOS) => ({
      ...pcavDTOS,
      label: pcavDTOS.value,
    }));
  } else if (attrType === AttributeType.PACKAGE_MAIN) {
    attributeValues = packageDataMain?.map(({ pckCode }) => ({
      id: null,
      label: pckCode,
      value: pckCode,
    }));
  } else if (attrType === AttributeType.PACKAGE_SUB) {
    attributeValues = packageDataSub?.map(({ pckCode }) => ({
      id: null,
      label: pckCode,
      value: pckCode,
    }));
  } else if (attrType === AttributeType.SIM) {
    attributeValues = [
      ...(simData?.map(({ label, value }) => ({
        id: null,
        label,
        value,
      })) ?? []),
    ];
  } else if (attrType === AttributeType.COVERAGE_RANGE) {
    attributeValues = coverageRangesData.map(({ label, value }) => ({
      id: null,
      label,
      value: String(value),
    }));
  } else if (
    attrType === AttributeType.NHA_CUNG_CAP ||
    attrType === AttributeType.SKUID || 
    attrType === AttributeType.SO_NGAY_SU_DUNG || 
    attrType === AttributeType.DUNG_LUONG_TOC_DO_CAO || 
    attrType === AttributeType.LOAI_GOI || 
    attrType === AttributeType.HET_TOC_DO_CAO_GIAM_XUONG
  ) {
    attributeValues = [];
  }
  else if(attrType === AttributeType.CHIA_SE_WIFI){
    attributeValues = [
      {
        id:null,
        label:'Có',
        value:'1'
      },
      {
        id:null,
        label:'Không',
        value:'0'
      }
    ]
  } 
  else if (attrType === AttributeType.EKYC){
    attributeValues = [
        {
          id:null,
          label:'Bắt buộc',
          value:'1'
        },
        {
          id:null,
          label:'Không bắt buộc',
          value:'0'
        }
    ]
  }
  else {
    attributeValues = simData?.map(({ label, value }) => ({
      id: null,
      label,
      value,
    }));
  }
  
  return attributeValues;
};