import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { RouterConfig } from 'apps/Internal/src/routers/ProtectedRoute';
import { lazy } from 'react';

const ListUserGroup = lazy(() => import('./page/ListUserGroup'));
const ActionGroupUser = lazy(() => import('./page/ActionGroupUser'));

const routes: RouterConfig[] = [
  {
    path: pathRoutes.group_user_manager,
    page: <ListUserGroup />,
  },
  {
    path: pathRoutes.group_user_manager_add,
    page: <ActionGroupUser />,
  },
  {
    path: pathRoutes.groupUserManagerEdit(),
    page: <ActionGroupUser />,
  },
  {
    path: pathRoutes.groupUserManagerView(),
    page: <ActionGroupUser />,
  },
];

export default routes;
