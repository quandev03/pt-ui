import { RouteObject } from 'react-router-dom';
import { pathRoutes } from '../../routers';

const routes: RouteObject[] = [
  {
    path: pathRoutes.groupUserManager,
    lazy: async () => {
      const { ListUserGroup } = await import('./page');
      return { Component: ListUserGroup };
    },
  },
  {
    path: pathRoutes.groupUserManagerAdd,
    lazy: async () => {
      const { ActionGroupUser } = await import('./page/ActionGroupUser');
      return { Component: ActionGroupUser };
    },
  },
  {
    path: pathRoutes.groupUserManagerEdit(),
    lazy: async () => {
      const { ActionGroupUser } = await import('./page/ActionGroupUser');
      return { Component: ActionGroupUser };
    },
  },
  {
    path: pathRoutes.groupUserManagerView(),
    lazy: async () => {
      const { ActionGroupUser } = await import('./page/ActionGroupUser');
      return { Component: ActionGroupUser };
    },
  },
];

export default routes;
