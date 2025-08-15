import { RouteObject } from 'react-router-dom';
import { pathRoutes } from '../../routers/url';

const routesUploadNumber: RouteObject[] = [
  {
    path: pathRoutes.uploadNumber,
    lazy: async () => {
      const { ListPage } = await import('./page');
      return { Component: ListPage };
    },
  },
  {
    path: pathRoutes.uploadNumberAdd,
    lazy: async () => {
      const { ActionPage } = await import('./page');
      return { Component: ActionPage };
    },
  },
  {
    path: pathRoutes.uploadNumberView(':id'),
    lazy: async () => {
      const { ActionPage } = await import('./page');
      return { Component: ActionPage };
    },
  },
];
export default routesUploadNumber;
