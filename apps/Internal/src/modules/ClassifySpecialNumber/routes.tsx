import { lazy } from 'react';
import { RouterConfig } from '../../routers/ProtectedRoute';
import { pathRoutes } from '../../constants/routes';
import { ActionType } from '@react/constants/app';

const Page = lazy(() => import('./page'));
const ActionPage = lazy(() => import('./page/ActionPage'));

const routes: RouterConfig[] = [
  {
    path: pathRoutes.classifySpecialNumber,
    page: <Page />,
  },
  {
    path: pathRoutes.classifySpecialNumberAdd,
    page: <ActionPage typeModal={ActionType.ADD} />,
  },
  {
    path: pathRoutes.classifySpecialNumberView(),
    page: <ActionPage typeModal={ActionType.VIEW} />,
  },
];

export default routes;
