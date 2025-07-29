import { ActionType } from '@react/constants/app';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { RouterConfig } from 'apps/Internal/src/routers/ProtectedRoute';
import { lazy } from 'react';

const Page = lazy(() => import('./page'));
const PageAdd = lazy(() => import('./page/add'));
const routes: RouterConfig[] = [
  {
    path: pathRoutes.stockOutForDistributor,
    page: <Page />,
  },
  {
    path: pathRoutes.stockOutForDistributorAdd,
    page: <PageAdd typeModal={ActionType.ADD} />,
  },
  {
    path: pathRoutes.stockOutForDistributorView(),
    page: <PageAdd typeModal={ActionType.VIEW} />,
  },
];

export default routes;
