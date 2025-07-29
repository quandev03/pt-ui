import { lazy } from 'react';
import { pathRoutes } from '../../constants/routes';
import { RouterConfig } from '../../routers/ProtectedRoute';

const ListUser = lazy(() => import('./page/ListUser'));
const ActionUser = lazy(() => import('./page/ActionUser'));

const userRoutes: RouterConfig[] = [
  {
    path: pathRoutes.userManager,
    page: <ListUser />,
  },
  {
    path: pathRoutes.userManagerView(),
    page: <ActionUser />,
  },
  {
    path: pathRoutes.userManagerEdit(),
    page: <ActionUser />,
  },
  {
    path: pathRoutes.userManagerAdd,
    page: <ActionUser />,
  },
];

export default userRoutes;
