import { IPage, IParamsRequest } from '@vissoft-react/common';
import { safeApiClient } from '../../../../src/services';
import {
  IEsimWarehouseDetails,
  IEsimWarehouseList,
  IPackage,
  IQrCodeSent,
} from '../types';
import { prefixSaleService } from '../../../../src/constants';

export const esimWarehouseServices = {
  getEsimWarehouseList: (params: IParamsRequest) => {
    // return safeApiClient.get<IPage<IEsimWarehouseList>>(
    //   `${prefixSaleService}/esim-manager`,
    //   {
    //     params,
    //   }
    // );
    return {
      numberOfElements: 5,
      number: 0,
      totalElements: 5,
      totalPages: 1,
      size: 20,
      content: [
        {
          isdn: 84912345678,
          serial: 'SIM123456789',
          packCode: 'DATA_5GB',
          orderNo: 'ORD001',
          orgCode: 'ORG_VN1',
          orgName: 'Vietnam Branch 1',
          status: 1,
          status900: 0,
          activeStatus: 1,
          modifiedDate: '2025-08-05T15:30:22.123456+07:00',
          genQrBy: 'system_admin',
          subId: 'SUB123456',
        },
        {
          isdn: 84987654321,
          serial: 'SIM987654321',
          packCode: 'DATA_10GB',
          orderNo: 'ORD002',
          orgCode: 'ORG_VN2',
          orgName: 'Vietnam Branch 2',
          status: 0,
          status900: 1,
          activeStatus: 10,
          modifiedDate: '2025-08-04T10:15:45.987654+07:00',
          genQrBy: 'user_01',
          subId: 'SUB654321',
        },
        {
          isdn: 84955512345,
          serial: 'SIM555123456',
          packCode: 'VOICE_500MIN',
          orderNo: 'ORD003',
          orgCode: 'ORG_VN3',
          orgName: 'Vietnam Branch 3',
          status: 1,
          status900: 1,
          activeStatus: 11,
          modifiedDate: '2025-08-03T08:22:33.456789+07:00',
          genQrBy: 'system_admin',
          subId: 'SUB789123',
        },
        {
          isdn: 84944467890,
          serial: 'SIM444678901',
          packCode: 'COMBO_5GB_100MIN',
          orderNo: 'ORD004',
          orgCode: 'ORG_VN1',
          orgName: 'Vietnam Branch 1',
          status: 0,
          status900: 0,
          activeStatus: 20,
          modifiedDate: '2025-08-02T14:50:11.654321+07:00',
          genQrBy: 'user_02',
          subId: 'SUB456789',
        },
        {
          isdn: 84933398765,
          serial: 'SIM333987654',
          packCode: 'DATA_2GB',
          orderNo: 'ORD005',
          orgCode: 'ORG_VN4',
          orgName: 'Vietnam Branch 4',
          status: 1,
          status900: 0,
          activeStatus: 21,
          modifiedDate: '2025-08-01T09:10:20.321654+07:00',
          genQrBy: 'system_admin',
          subId: 'SUB987654',
        },
      ],
      pageable: {
        offset: 0,
        pageNumber: 0,
        pageSize: 20,
        paged: true,
        sort: {
          empty: true,
          sorted: false,
          unsorted: true,
        },
        unpaged: false,
      },
      sort: {
        empty: true,
        sorted: false,
        unsorted: true,
      },
    };
  },

  getDetailEsimWarehouse: async ({ subId }: { subId?: string }) => {
    // return await safeApiClient.get<IEsimWarehouseDetails>(
    //   `${prefixSaleService}/esim-manager/${subId}`
    // );
    return [
      {
        id: 'a1b2c3d4-e5f6-4g7h-8i9j-0k1l2m3n4o5p',
        subId: 'SUB123456',
        actionDate: '2025-08-06T10:15:30.123456+07:00',
        actionCode: 'ACTIVATE',
        description: 'Activated eSIM for package HVN2',
        shopCode: 'ORG_VN1',
        empCode: 'EMP001',
        empName: 'Nguyen Van A',
        reasonCode: 'RC001',
        reasonNote: 'Customer requested activation',
        createdDate: '2025-07-31T17:02:49.28093+07:00',
        createdBy: 'phucmnp@gmail.com',
      },
      {
        id: 'b2c3d4e5-f6g7-4h8i-9j0k-1l2m3n4o5p6',
        subId: 'SUB654321',
        actionDate: '2025-08-05T14:20:45.987654+07:00',
        actionCode: 'DEACTIVATE',
        description: 'Deactivated eSIM due to package expiration',
        shopCode: 'ORG_VN2',
        empCode: 'EMP002',
        empName: 'Tran Thi B',
        reasonCode: 'RC002',
        reasonNote: 'Package DATA_10GB expired',
        createdDate: '2025-08-04T10:15:45.987654+07:00',
        createdBy: 'pthao331999@gmail.com',
      },
      {
        id: 'c3d4e5f6-g7h8-4i9j-0k1l-2m3n4o5p6q7',
        subId: 'SUB789123',
        actionDate: '2025-08-03T09:30:22.456789+07:00',
        actionCode: 'TRANSFER',
        description: 'Transferred eSIM to new user',
        shopCode: 'ORG_VN3',
        empCode: 'EMP003',
        empName: 'Le Van C',
        reasonCode: 'RC003',
        reasonNote: 'Customer requested eSIM transfer',
        createdDate: '2025-08-03T08:22:33.456789+07:00',
        createdBy: 'system_admin@gmail.com',
      },
      {
        id: 'd4e5f6g7-h8i9-4j0k-1l2m-3n4o5p6q7r8',
        subId: 'SUB456789',
        actionDate: '2025-08-02T16:45:11.654321+07:00',
        actionCode: 'UPDATE',
        description: 'Updated eSIM package to COMBO_5GB_100MIN',
        shopCode: 'ORG_VN1',
        empCode: 'EMP004',
        empName: 'Pham Thi D',
        reasonCode: 'RC004',
        reasonNote: 'Customer upgraded package',
        createdDate: '2025-08-02T14:50:11.654321+07:00',
        createdBy: 'user_02@gmail.com',
      },
      {
        id: 'e5f6g7h8-i9j0-4k1l-2m3n-4o5p6q7r8s9',
        subId: 'SUB987654',
        actionDate: '2025-08-01T11:25:20.321654+07:00',
        actionCode: 'ACTIVATE',
        description: 'Activated eSIM for package DATA_2GB',
        shopCode: 'ORG_VN4',
        empCode: 'EMP005',
        empName: 'Hoang Van E',
        reasonCode: 'RC001',
        reasonNote: 'New customer activation',
        createdDate: '2025-08-01T09:10:20.321654+07:00',
        createdBy: 'system_admin@gmail.com',
      },
    ];
  },

  getSendQrCode: async (data: IQrCodeSent) => {
    const { ...payload } = data;
    const createNewEsimRes = await safeApiClient.post<IQrCodeSent>(
      `${prefixSaleService}/esim-free/book`,
      payload
    );
    return createNewEsimRes;
  },

  getPackageCodes: async () => {
    const res = await safeApiClient.get<IPackage[]>(
      `${prefixSaleService}/esim-free/get-package`
    );
    if (!res) throw new Error('Oops');
    return res;
  },
};
