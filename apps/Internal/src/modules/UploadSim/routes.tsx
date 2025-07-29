import { lazy } from 'react';
import { RouterConfig } from '../../routers/ProtectedRoute';
import { pathRoutes } from '../../constants/routes';

const Page = lazy(() => import('./page'));
const PageAdd = lazy(() => import('./page/add'));
const PageView = lazy(() => import('./page/view'));

const routes: RouterConfig[] = [
  {
    path: pathRoutes.simUpload,
    page: <Page />,
  },
  {
    path: pathRoutes.simUploadAdd,
    page: <PageAdd />,
  },
  {
    path: pathRoutes.simUploadView(),
    page: <PageView />,
  },
];

export default routes;
