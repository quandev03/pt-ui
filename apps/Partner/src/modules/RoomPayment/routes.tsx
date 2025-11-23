import { RouteObject } from 'react-router-dom';
import { pathRoutes } from '../../routers';

export const roomPaymentRoutes: RouteObject[] = [
  {
    path: pathRoutes.roomPayment,
    lazy: async () => {
      const { ListRoomPayment } = await import('./pages/ListRoomPayment');
      return { Component: ListRoomPayment };
    },
  },
  {
    path: pathRoutes.roomPaymentDetail(),
    lazy: async () => {
      const { RoomPaymentDetail } = await import('./pages/RoomPaymentDetail');
      return { Component: RoomPaymentDetail };
    },
  },
];




