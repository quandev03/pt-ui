import { RouteObject } from 'react-router-dom';
import { pathRoutes } from '../../routers';

const partnerOrderReportRoutes: RouteObject[] = [
  {
    path: pathRoutes.partnerOrderReport,
    lazy: async () => {
      const { ListPartnerOrderReport } = await import('./pages');
      return { Component: ListPartnerOrderReport };
    },
  },
];

export default partnerOrderReportRoutes;
