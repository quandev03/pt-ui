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
  {
    path: pathRoutes.partnerCatalogUserManagement(),
    lazy: async () => {
      const { PartnerCatalogUserManagement } = await import(
        './pages/PartnerCatologUserManagement'
      );
      return { Component: PartnerCatalogUserManagement };
    },
  },
  {
    path: pathRoutes.partnerCatalogUserAdd(),
    lazy: async () => {
      const { ActionUserPartnerCatalog } = await import(
        './pages/ActionUserPartnerCatalog'
      );
      return { Component: ActionUserPartnerCatalog };
    },
  },
  {
    path: pathRoutes.partnerCatalogUserEdit(),
    lazy: async () => {
      const { ActionUserPartnerCatalog } = await import(
        './pages/ActionUserPartnerCatalog'
      );
      return { Component: ActionUserPartnerCatalog };
    },
  },
  {
    path: pathRoutes.partnerCatalogUserView(),
    lazy: async () => {
      const { ActionUserPartnerCatalog } = await import(
        './pages/ActionUserPartnerCatalog'
      );
      return { Component: ActionUserPartnerCatalog };
    },
  },
];

export default partnerCatalogRoutes;
