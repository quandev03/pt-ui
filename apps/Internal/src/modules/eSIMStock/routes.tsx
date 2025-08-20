import { pathRoutes } from '../../routers';
import { RouteObject } from 'react-router-dom';

const eSIMStockRoutes: RouteObject[] = [
  {
    path: pathRoutes.eSIMStock,
    lazy: async () => {
      const { ListeSIMStock } = await import('./pages/ListeSIMStock');
      return { Component: ListeSIMStock };
    },
  },
];

export default eSIMStockRoutes;
