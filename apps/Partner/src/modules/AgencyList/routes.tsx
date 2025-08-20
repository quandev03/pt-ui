import { RouteObject } from 'react-router-dom';
import { pathRoutes } from '../../routers';

export const routesAgencyList: RouteObject[] = [
  {
    path: pathRoutes.agencyList,
    lazy: async () => {
      const { AgencyList } = await import('./pages');
      return { Component: AgencyList };
    },
  },
  {
    path: pathRoutes.agencyView(),
    lazy: async () => {
      const { AgencyAction } = await import('./pages');
      return { Component: AgencyAction };
    },
  },
  {
    path: pathRoutes.agencyEdit(),
    lazy: async () => {
      const { AgencyAction } = await import('./pages');
      return { Component: AgencyAction };
    },
  },
  {
    path: pathRoutes.agencyAdd,
    lazy: async () => {
      const { AgencyAction } = await import('./pages');
      return { Component: AgencyAction };
    },
  },
];
