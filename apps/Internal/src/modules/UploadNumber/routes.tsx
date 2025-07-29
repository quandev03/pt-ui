import { lazy } from 'react';
import { pathRoutes } from '../../constants/routes';
import { RouterConfig } from '../../routers/ProtectedRoute';
import { ActionType } from '@react/constants/app';

const Page = lazy(() => import('./page'));
const ActionPage = lazy(() => import('./page/ActionPage'));

const routes: RouterConfig[] = [
  {
    path: pathRoutes.uploadNumber,
    page: <Page />,
  },
  {
    path: pathRoutes.uploadNumberAdd,
    page: <ActionPage actionType={ActionType.ADD} />,
  },
  {
    path: pathRoutes.uploadNumberView(),
    page: <ActionPage actionType={ActionType.VIEW} />,
  },
];

export default routes;
