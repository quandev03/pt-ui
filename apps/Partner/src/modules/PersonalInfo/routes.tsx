import { RouteObject } from 'react-router-dom';
import { pathRoutes } from '../../routers/url';

const routesPersonalInfo: RouteObject[] = [
  {
    path: pathRoutes.profile,
    lazy: async () => {
      const { ActionPage } = await import('./page');
      return { Component: ActionPage };
    },
  },
];
export default routesPersonalInfo;
