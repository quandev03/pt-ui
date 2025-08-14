import { RouteObject } from 'react-router-dom';
import { pathRoutes } from '../../routers/url';

const routesLookupNumber: RouteObject[] = [
  {
    path: pathRoutes.lookupNumber,
    lazy: async () => {
      const { ListPage } = await import('./page');
      return { Component: ListPage };
    },
  },
];
export default routesLookupNumber;
