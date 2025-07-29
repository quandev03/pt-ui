import { lazy } from 'react';
import { pathRoutes } from '../../constants/routes';
import { RouterConfig } from '../../routers/ProtectedRoute';
import { ActionType } from '@react/constants/app';

const Page = lazy(() => import('./page'));
const ActionPage = lazy(() => import('./page/ActionPage'));
const routes: RouterConfig[] = [
  {
    path: pathRoutes.revokeNumber,
    page: <Page />,
  },
  {
    path: pathRoutes.revokeNumberAdd,
    page: <ActionPage typeModal={ActionType.ADD} />,
  },
  {
    path: pathRoutes.revokeNumberView(),
    page: <ActionPage typeModal={ActionType.VIEW} />,
  },
];

export default routes;
