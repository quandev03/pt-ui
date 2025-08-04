import { pathRoutes } from '../../../routers/url';
import { RouteObject } from 'react-router-dom';

const freeEsimBookingRoutes: RouteObject[] = [
  {
    path: pathRoutes.freeEsimBooking,
    lazy: async () => {
      const { ListFreeEsim } = await import('./pages');
      return { Component: ListFreeEsim };
    },
  },
  {
    path: pathRoutes.freeEsimBookingAdd,
    lazy: async () => {
      const { ActionFreeEsim } = await import('./pages');
      return { Component: ActionFreeEsim };
    },
  },
  {
    path: pathRoutes.freeEsimBookingView(),
    lazy: async () => {
      const { ActionFreeEsim } = await import('./pages');
      return { Component: ActionFreeEsim };
    },
  },
];

export default freeEsimBookingRoutes;
