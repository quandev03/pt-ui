import { lazy } from 'react';
import { pathRoutes } from '../../constants/routes';
import { RouterConfig } from '../../routers/ProtectedRoute';

const PartnerCatalogList = lazy(() => import('./pages/PartnerCatalogList'));
const ActionPartnerCatalog = lazy(() => import('./pages/ActionPartnerCatalog'));

const partnerCatalogRoutes: RouterConfig[] = [
  {
    path: pathRoutes.partnerCatalog,
    page: <PartnerCatalogList />,
  },
  {
    path: pathRoutes.partnerCatalogAdd,
    page: <ActionPartnerCatalog />,
  },
  {
    path: pathRoutes.partnerCatalogView(),
    page: <ActionPartnerCatalog />,
  },
  {
    path: pathRoutes.partnerCatalogEdit(),
    page: <ActionPartnerCatalog />,
  },
];

export default partnerCatalogRoutes;
