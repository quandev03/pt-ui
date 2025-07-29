import { lazy } from 'react';
import { RouterConfig } from '../../routers/ProtectedRoute';
import { pathRoutes } from '../../constants/routes';

const Page = lazy(() => import('./page'));
const PageAdd = lazy(() => import('./page/add'));
const PageEdit = lazy(() => import('./page/edit'));
const PageView = lazy(() => import('./page/view'));

const routes: RouterConfig[] = [
  {
    path: pathRoutes.discount,
    page: <Page />,
  },
  {
    path: pathRoutes.discountAdd,
    page: <PageAdd />,
  },
  {
    path: pathRoutes.discountEdit(),
    page: <PageEdit />,
  },
  {
    path: pathRoutes.discountView(),
    page: <PageView />,
  },
];

export default routes;
