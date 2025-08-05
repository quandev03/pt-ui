import { lazy } from 'react';
import { pathRoutes } from '../../routers';
import { RouteObject } from 'react-router-dom';
import { ActionPage } from './page';

const listOfServicePackageRoutes: RouteObject[] = [
  {
    path: pathRoutes.list_of_service_package,
    lazy: async () => {
      const { ListPage } = await import('./page');
      return { Component: ListPage };
    },
  },
  {
    path: pathRoutes.list_of_service_package_add,
    lazy: async () => {
      const { ActionPage } = await import('./page');
      return { Component: ActionPage };
    },
  },
  {
    path: pathRoutes.list_of_service_package_edit(':id'),
    element: <ActionPage />,
    lazy: async () => {
      const { ActionPage } = await import('./page');
      return { Component: ActionPage };
    },
  },
  {
    path: pathRoutes.list_of_service_package_view(':id'),
    element: <ActionPage />,
    lazy: async () => {
      const { ActionPage } = await import('./page');
      return { Component: ActionPage };
    },
  },
];

export default listOfServicePackageRoutes;
