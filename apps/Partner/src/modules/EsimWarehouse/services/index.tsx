import { IPage, IParamsRequest } from '@vissoft-react/common';
import { safeApiClient } from '../../../../src/services';
import {
  IEsimWarehouseDetails,
  IEsimWarehouseList,
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
    return await safeApiClient.get<IEsimWarehouseDetails>(
      `${prefixSaleService}/esim-manager/${subId}`
    );
  },

  getSendQrCode: async (data: IQrCodeSent) => {
    const { ...payload } = data;
    const createNewEsimRes = await safeApiClient.post<IQrCodeSent>(
      `${prefixSaleService}/esim-free/book`,
      payload
    );
    return createNewEsimRes;
  },
};
