import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { pathRoutes } from '../../routers';

const partnerCatalogRoutes: RouteObject[] = [
  {
    path: pathRoutes.partnerCatalog,
    lazy: async () => {
      const { PartnerCatalogList } = await import('./pages');
      return {
        Component: PartnerCatalogList,
      };
    },
  },
  {
    path: pathRoutes.partnerCatalogAdd,
    lazy: async () => {
      const { ActionPartnerCatalog } = await import(
        './pages/ActionPartnerCatalog'
      );
      return { Component: ActionPartnerCatalog };
    },
  },
  {
    path: pathRoutes.partnerCatalogView(),
    lazy: async () => {
      const { ActionPartnerCatalog } = await import(
        './pages/ActionPartnerCatalog'
      );
      return { Component: ActionPartnerCatalog };
    },
  },
  {
    path: pathRoutes.partnerCatalogEdit(),
    lazy: async () => {
      const { ActionPartnerCatalog } = await import(
        './pages/ActionPartnerCatalog'
      );
      return { Component: ActionPartnerCatalog };
    },
  },
];

export default partnerCatalogRoutes;
