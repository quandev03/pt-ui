import { pathRoutes } from '../../routers/url';
import { RouteObject } from 'react-router-dom';

const routesDashboard: RouteObject[] = [
  {
    path: pathRoutes.dashboard,
    lazy: async () => {
      const { ListPage } = await import('./page/ListPage');
      return { Component: ListPage };
    },
  },
];

export default routesDashboard;
