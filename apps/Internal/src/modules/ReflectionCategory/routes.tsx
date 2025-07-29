import { ActionType } from '@react/constants/app';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { RouterConfig } from 'apps/Internal/src/routers/ProtectedRoute';
import { lazy } from 'react';

const Page = lazy(() => import('./page'));
const ActionPage = lazy(() => import('./page/ActionPage'));

const routes: RouterConfig[] = [
  {
    path: pathRoutes.reflectionCategory,
    page: <Page />,
  },
  {
    path: pathRoutes.reflectionCategoryAdd,
    page: <ActionPage type={ActionType.ADD} />,
  },
  {
    path: pathRoutes.reflectionCategoryEdit(),
    page: <ActionPage type={ActionType.EDIT} />,
  },
  {
    path: pathRoutes.reflectionCategoryView(),
    page: <ActionPage type={ActionType.VIEW} />,
  },
];

export default routes;
