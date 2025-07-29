import { pathRoutes } from '../../constants/routes';
import { RouterConfig } from 'apps/Internal/src/routers/ProtectedRoute';
import { lazy } from 'react';

const ListRole = lazy(() => import('./page/ListRole'));
const ActionRole = lazy(() => import('./page/ActionRole'));

const roleRoutes: RouterConfig[] = [
  {
    path: pathRoutes.role_manager,
    page: <ListRole isPartner={false} />,
  },
  {
    path: pathRoutes.role_manager_add,
    page: <ActionRole isPartner={false} />,
  },
  {
    path: pathRoutes.roleManagerEdit(),
    page: <ActionRole isPartner={false} />,
  },
  {
    path: pathRoutes.roleManagerView(),
    page: <ActionRole isPartner={false} />,
  },

  {
    path: pathRoutes.role_partner_manager,
    page: <ListRole isPartner={true} />,
  },
  {
    path: pathRoutes.role_partner_manager_add,
    page: <ActionRole isPartner={true} />,
  },
  {
    path: pathRoutes.rolePartnerManagerEdit(),
    page: <ActionRole isPartner={true} />,
  },
  {
    path: pathRoutes.rolePartnerManagerView(),
    page: <ActionRole isPartner={true} />,
  },
];

export default roleRoutes;
