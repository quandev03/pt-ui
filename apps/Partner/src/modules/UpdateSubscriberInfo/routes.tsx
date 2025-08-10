import { RouteObject } from 'react-router-dom';
import { pathRoutes } from '../../routers';

export const routesUpdateSubscriberInfo: RouteObject[] = [
  {
    path: pathRoutes.updateSubscriberInfo,
    lazy: async () => {
      const { UpdateSubscriberInfo } = await import('./pages');
      return { Component: UpdateSubscriberInfo };
    },
  },
];
