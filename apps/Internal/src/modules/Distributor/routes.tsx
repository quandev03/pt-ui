import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { RouterConfig } from 'apps/Internal/src/routers/ProtectedRoute';
import { lazy } from 'react';

const Page = lazy(() => import('./page'));
const PageAdd = lazy(() => import('./page/add'));

const routes: RouterConfig[] = [
  {
    path: pathRoutes.distributor,
    page: <Page />,
  },
  {
    path: pathRoutes.distributorAdd,
    page: <PageAdd />,
  },
];

export default routes;
