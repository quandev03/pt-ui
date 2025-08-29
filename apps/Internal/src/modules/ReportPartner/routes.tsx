import { RouteObject } from 'react-router-dom';
import { pathRoutes } from '../../routers/url';

export const routesReportPartner: RouteObject[] = [
  {
    path: pathRoutes.reportPartner,
    lazy: async () => {
      const { ListReportPartner } = await import('./pages/ListReport');
      return { Component: ListReportPartner };
    },
  },
];
