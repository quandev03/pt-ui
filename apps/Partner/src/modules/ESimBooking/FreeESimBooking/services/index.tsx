import { IPage, IParamsRequest } from '@vissoft-react/common';
import { IFreeEsimBooking } from '../types';

export const freeEsimBookingServices = {
  getListFreeEsimBooking: async (
    params: IParamsRequest
  ): Promise<IPage<IFreeEsimBooking>> => {
    // The new mock data array
    const mockFreeEsimBookings: IFreeEsimBooking[] = [
      {
        id: '01K1FYQZFJR78C4AW1N66ZKC6S',
        eSimTotalNumber: 3,
        package: 'Basic Plan',
        user: 'chuongcn',
        createdTime: '2025-07-31T16:59:18.260109+07:00',
        duration: '7 days',
        processStatus: 'Completed',
        result: 'Success',
      },
      {
        id: '01K1F43NQ49FQJN6EYG4J18HYV',
        eSimTotalNumber: 1,
        package: 'Traveler 7D',
        user: 'test123',
        createdTime: '2025-07-31T09:13:49.926485+07:00',
        duration: '15 days',
        processStatus: 'Pending',
        result: 'Awaiting Confirmation',
      },
      {
        id: '01J86QN092KH0HNEAN7DD6BH00',
        eSimTotalNumber: 5,
        package: 'Premium Global',
        user: 'phucmnp@gmail.com',
        createdTime: '2024-11-26T13:19:06+07:00',
        duration: '30 days',
        processStatus: 'In Progress',
        result: 'Processing eSIM',
      },
      {
        id: '01J7KJNASMZ85GP25XDCY7A4R6',
        eSimTotalNumber: 2,
        package: 'Family Pack',
        user: 'mngoc0710@gmail.com',
        createdTime: '2024-09-09T13:19:06+07:00',
        duration: '7 days',
        processStatus: 'Failed',
        result: 'Payment Error',
      },
      {
        id: '01K1A1YTG4C7RN3SQ7C4XYWW7P',
        eSimTotalNumber: 4,
        package: 'Basic Plan',
        user: 'cs3.hcm@dieuphuc.com.vn',
        createdTime: '2025-07-29T10:00:01.668837+07:00',
        duration: '15 days',
        processStatus: 'Completed',
        result: 'Success',
      },
      {
        id: '01JF7HWPBNH2Z1NB72B26KF693',
        eSimTotalNumber: 1,
        package: 'Traveler 7D',
        user: 'quannv@vnsky.vn',
        createdTime: '2024-12-16T17:58:12.981905+07:00',
        duration: '30 days',
        processStatus: 'Pending',
        result: 'Awaiting Confirmation',
      },
      {
        id: '01K0ZY1PK662VBHZ3ABP96BVGE',
        eSimTotalNumber: 3,
        package: 'Premium Global',
        user: 'jane_doe123@company.co.uk',
        createdTime: '2025-07-25T11:39:17.350526+07:00',
        duration: '7 days',
        processStatus: 'In Progress',
        result: 'Processing eSIM',
      },
    ];

    return mockFreeEsimBookings;
  },
};
