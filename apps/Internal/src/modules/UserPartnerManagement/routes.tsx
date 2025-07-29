import { lazy } from 'react';
import { pathRoutes } from '../../constants/routes';
import { RouterConfig } from '../../routers/ProtectedRoute';

const ListUser = lazy(() => import('./page/ListUser'));
const ActionUser = lazy(() => import('./page/ActionUser'));

const userPartnerRoutes: RouterConfig[] = [
  {
    path: pathRoutes.partnerCatalogUserManagement(),
    page: <ListUser />,
  },
  {
    path: pathRoutes.partnerCatalogUserAdd(),
    page: <ActionUser />,
  },
  {
    path: pathRoutes.partnerCatalogUserView(),
    page: <ActionUser />,
  },
  {
    path: pathRoutes.partnerCatalogUserEdit(),
    page: <ActionUser />,
  },
];

export default userPartnerRoutes;
