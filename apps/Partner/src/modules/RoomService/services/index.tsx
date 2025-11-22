import { IPage } from '@vissoft-react/common';
import { prefixSaleService } from '../../../../src/constants';
import { safeApiClient } from '../../../../src/services';
import {
  IRoomService,
  IRoomServiceForm,
  IRoomServiceParams,
} from '../types';

export const roomServiceServices = {
  getRoomServiceList: (params: IRoomServiceParams) => {
    return safeApiClient.get<IRoomService[]>(
      `${prefixSaleService}/room-services`,
      {
        params,
      }
    );
  },

  getRoomServiceDetail: async (id: string) => {
    return await safeApiClient.get<IRoomService>(
      `${prefixSaleService}/room-services/${id}`
    );
  },

  createRoomService: async (data: IRoomServiceForm) => {
    return await safeApiClient.post<IRoomService>(
      `${prefixSaleService}/room-services`,
      data
    );
  },

  updateRoomService: async (id: string, data: Partial<IRoomServiceForm>) => {
    return await safeApiClient.put<IRoomService>(
      `${prefixSaleService}/room-services/${id}`,
      data
    );
  },

  deleteRoomService: async (id: string) => {
    return await safeApiClient.delete<void>(
      `${prefixSaleService}/room-services/${id}`
    );
  },
};

