import { lazy } from 'react';
import { RouterConfig } from '../../routers/ProtectedRoute';
import { pathRoutes } from '../../constants/routes';

const Page = lazy(() => import('./pages'));
const PageDetail = lazy(() => import('./pages/detail'));
const PageAdd = lazy(() => import('./pages/add'));
const routes: RouterConfig[] = [
  {
    path: pathRoutes.simReplacement,
    page: <Page />,
  },
  {
    path: pathRoutes.simReplacementDetail(),
    page: <PageDetail />,
  },
  {
    path: pathRoutes.simReplacementAdd,
    page: <PageAdd />,
  },
];
export default routes;
