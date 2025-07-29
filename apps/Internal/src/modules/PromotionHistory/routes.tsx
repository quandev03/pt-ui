import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { RouterConfig } from 'apps/Internal/src/routers/ProtectedRoute';
import { lazy } from 'react';

const Page = lazy(() => import('./page'));
const PageAdd = lazy(() => import('./page/add'));
const PageEdit = lazy(() => import('./page/edit'));
const PageView = lazy(() => import('./page/view'));

const routes: RouterConfig[] = [
  {
    path: pathRoutes.promotionHistory,
    page: <Page />,
  },
  {
    path: pathRoutes.promotionHistoryAdd,
    page: <PageAdd />,
  },
  {
    path: pathRoutes.promotionHistoryEdit(),
    page: <PageEdit />,
  },
  {
    path: pathRoutes.promotionHistoryView(),
    page: <PageView />,
  },
];

export default routes;
