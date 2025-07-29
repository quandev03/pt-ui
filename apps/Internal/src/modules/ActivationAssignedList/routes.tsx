import { lazy } from 'react';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { RouterConfig } from 'apps/Internal/src/routers/ProtectedRoute';

const Page = lazy(() => import('./page'));

const routes: RouterConfig[] = [
  {
    path: pathRoutes.activationAssignedList,
    page: <Page />,
  },
];

export default routes;
