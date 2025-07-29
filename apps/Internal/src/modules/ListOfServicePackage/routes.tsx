import { lazy } from 'react';
import { pathRoutes } from '../../constants/routes';
import { RouterConfig } from '../../routers/ProtectedRoute';

const Page = lazy(() => import('./page'));
const PageAdd = lazy(() => import('./page/add'));
const PageEdit = lazy(() => import('./page/edit'));
const PageView = lazy(() => import('./page/view'));

const routes: RouterConfig[] = [
  {
    path: pathRoutes.list_of_service_package,
    page: <Page />,
  },
  {
    path: pathRoutes.list_of_service_package_add,
    page: <PageAdd />,
  },
  {
    path: pathRoutes.list_of_service_package_edit(),
    page: <PageEdit />,
  },
  {
    path: pathRoutes.list_of_service_package_view(),
    page: <PageView />,
  },
];

export default routes;
