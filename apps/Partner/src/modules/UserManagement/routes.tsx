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
  // {
  //   path: pathRoutes.userManagerView(),
  //   page: <ActionUser />,
  // },
  // {
  //   path: pathRoutes.userManagerEdit(),
  //   page: <ActionUser />,
  // },
  // {
  //   path: pathRoutes.userManagerAdd,
  //   page: <ActionUser />,
  // },
];
