import { RouteObject } from 'react-router-dom';
import { pathRoutes } from '../../routers';

export const eSimWareHouseRoutes: RouteObject[] = [
  {
    path: pathRoutes.esimWarehouse,
    lazy: async () => {
      const { ListEsimWarehouse } = await import('./pages');
      return { Component: ListEsimWarehouse };
    },
  },
];
