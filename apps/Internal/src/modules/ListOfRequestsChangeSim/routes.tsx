import { lazy } from 'react';
import { pathRoutes } from '../../constants/routes';
import { RouterConfig } from '../../routers/ProtectedRoute';

const Page = lazy(() => import('./page'));
const PageView = lazy(() => import('./page/add'));
const PageEdit = lazy(() => import('./page/view'));
const routes: RouterConfig[] = [
  {
    path: pathRoutes.listOfRequestsChangeSim,
    page: <Page />,
  },
  {
    path: pathRoutes.listOfRequestsChangeSimAdd,
    page: <PageView />,
  },
  {
    path: pathRoutes.listOfRequestsChangeSimView(),
    page: <PageEdit />,
  },
];

export default routes;
