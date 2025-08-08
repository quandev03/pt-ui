import { pathRoutes } from '../../routers/url';
import { RouteObject } from 'react-router-dom';

export const routesDashboard: RouteObject[] = [
  {
    path: pathRoutes.dashboard,
    lazy: async () => {
      const { ListPage } = await import('./page');
      return { Component: ListPage };
    },
  },
];

export default routesDashboard;
