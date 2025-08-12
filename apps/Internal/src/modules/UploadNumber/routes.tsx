import { RouteObject } from 'react-router-dom';
import { pathRoutes } from '../../routers';

export const routesUploadNumber: RouteObject[] = [
  {
    path: pathRoutes.uploadNumber,
    lazy: async () => {
      const { ListUploadNumber } = await import('./pages');
      return { Component: ListUploadNumber };
    },
  },
];
