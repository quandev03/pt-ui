import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { RouterConfig } from 'apps/Internal/src/routers/ProtectedRoute';
import { lazy } from 'react';

const Page = lazy(() => import('./page'));
const PageAdd = lazy(() => import('./page/add'));
const PageEdit = lazy(() => import('./page/edit'));
const PageView = lazy(() => import('./page/view'));

const routes: RouterConfig[] = [
  {
    path: pathRoutes.listOfDepartment,
    page: <Page />,
  },
  {
    path: pathRoutes.listOfDepartmentAdd,
    page: <PageAdd />,
  },
  {
    path: pathRoutes.listOfDepartmentEdit(),
    page: <PageEdit />,
  },
  {
    path: pathRoutes.listOfDepartmentView(),
    page: <PageView />,
  },
];

export default routes;
