import { RouteObject } from 'react-router-dom';
import { pathRoutes } from '../../routers';

export const advertisementManagementRoutes: RouteObject[] = [
  {
    path: pathRoutes.advertisementManagement,
    lazy: async () => {
      const { ListAdvertisement } = await import('./pages');
      return { Component: ListAdvertisement };
    },
  },
  {
    path: pathRoutes.advertisementManagementAdd,
    lazy: async () => {
      const { ActionAdvertisement } = await import('./pages');
      return { Component: ActionAdvertisement };
    },
  },
  {
    path: pathRoutes.advertisementManagementEdit(),
    lazy: async () => {
      const { ActionAdvertisement } = await import('./pages');
      return { Component: ActionAdvertisement };
    },
  },
  {
    path: pathRoutes.advertisementManagementView(),
    lazy: async () => {
      const { ActionAdvertisement } = await import('./pages');
      return { Component: ActionAdvertisement };
    },
  },
];

