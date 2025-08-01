import { lazy } from 'react';
import { pathRoutes } from '../../routers/url';
import { RouteObject } from 'react-router-dom';

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
