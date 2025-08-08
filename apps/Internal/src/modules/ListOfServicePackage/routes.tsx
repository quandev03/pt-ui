import { lazy } from 'react';
import { pathRoutes } from '../../routers';
import { RouteObject } from 'react-router-dom';
import { ActionPage } from './page';

const listOfServicePackageRoutes: RouteObject[] = [
  {
    path: pathRoutes.listOfServicePackage,
    lazy: async () => {
      const { ListPage } = await import('./page');
      return { Component: ListPage };
    },
  },
  {
    path: pathRoutes.listOfServicePackageAdd,
    lazy: async () => {
      const { ActionPage } = await import('./page');
      return { Component: ActionPage };
    },
  },
  {
    path: pathRoutes.listOfServicePackageEdit(':id'),
    element: <ActionPage />,
    lazy: async () => {
      const { ActionPage } = await import('./page');
      return { Component: ActionPage };
    },
  },
  {
    path: pathRoutes.listOfServicePackageView(':id'),
    element: <ActionPage />,
    lazy: async () => {
      const { ActionPage } = await import('./page');
      return { Component: ActionPage };
    },
  },
];

export default listOfServicePackageRoutes;
