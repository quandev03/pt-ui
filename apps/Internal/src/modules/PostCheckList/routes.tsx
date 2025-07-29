import { lazy } from 'react';
import { pathRoutes } from '../../constants/routes';
import { RouterConfig } from '../../routers/ProtectedRoute';

const Page = lazy(() => import('./page'));
const PageView = lazy(() => import('./page/view'));
const routes: RouterConfig[] = [
  {
    path: pathRoutes.post_check_list,
    page: <Page />,
  },
  {
    path: pathRoutes.post_check_list_view(),
    page: <PageView />,
  }
];

export default routes;
