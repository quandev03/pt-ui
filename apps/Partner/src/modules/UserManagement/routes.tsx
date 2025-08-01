import { RouteObject } from 'react-router-dom';
import { pathRoutes } from '../../routers';

export const routesUserManagement: RouteObject[] = [
  {
    path: pathRoutes.userManager,
    lazy: async () => {
      const { ListUser } = await import('./page');
      return { Component: ListUser };
    },
  },
  {
    path: pathRoutes.userManagerView(),
    lazy: async () => {
      const { ActionUser } = await import('./page');
      return { Component: ActionUser };
    },
  },
  {
    path: pathRoutes.userManagerEdit(),
    lazy: async () => {
      const { ActionUser } = await import('./page');
      return { Component: ActionUser };
    },
  },
  {
    path: pathRoutes.userManagerAdd,
    lazy: async () => {
      const { ActionUser } = await import('./page');
      return { Component: ActionUser };
    },
  },
];
