import { RouteObject } from 'react-router-dom';
import { pathRoutes } from '../../routers/url';

export const routesUserManagement: RouteObject[] = [
  {
    path: pathRoutes.systemUserManager,
    lazy: async () => {
      const { ListUser } = await import('./pages');
      return { Component: ListUser };
    },
  },
  {
    path: pathRoutes.systemUserManagerAdd,
    lazy: async () => {
      const { ActionUser } = await import('./pages');
      return { Component: ActionUser };
    },
  },
  {
    path: pathRoutes.systemUserManagerEdit(),
    lazy: async () => {
      const { ActionUser } = await import('./pages');
      return { Component: ActionUser };
    },
  },
  {
    path: pathRoutes.systemUserManagerView(),
    lazy: async () => {
      const { ActionUser } = await import('./pages');
      return { Component: ActionUser };
    },
  },
];
