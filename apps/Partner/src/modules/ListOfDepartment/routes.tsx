import { pathRoutes } from 'apps/Partner/src/constants/routes';
import { RouterConfig } from 'apps/Partner/src/routers/ProtectedRoute';
import { lazy } from 'react';

const Page = lazy(() => import('./page'));
const PageAdd = lazy(() => import('./page/add'));
const PageEdit = lazy(() => import('./page/edit'));
const PageView = lazy(() => import('./page/view'));

const warehouseManagementRoutes: RouterConfig[] = [
  {
    path: pathRoutes.warehouseManagement,
    page: <Page />,
  },
  {
    path: pathRoutes.warehouseManagementAdd,
    page: <PageAdd />,
  },
  {
    path: pathRoutes.warehouseManagementEdit(),
    page: <PageEdit />,
  },
  {
    path: pathRoutes.warehouseManagementView(),
    page: <PageView />,
  },
];

export default warehouseManagementRoutes;
