import { ActionType } from '@react/constants/app';
import { lazy } from 'react';
import { pathRoutes } from '../../constants/routes';
import { RouterConfig } from '../../routers/ProtectedRoute';

const MerchantEximPage = lazy(() => import('./pages/index'));
const AddView = lazy(() => import('./pages/AddView'));

const merchantEximRoutes: RouterConfig[] = [
  {
    path: pathRoutes.merchantEximTransList,
    page: <MerchantEximPage />,
  },
  {
    path: pathRoutes.merchantEximTransAddIm,
    page: <AddView actionType={ActionType.ADD} />,
  },
  {
    path: pathRoutes.merchantEximTransView(),
    page: <AddView actionType={ActionType.VIEW} />,
  },
];

export default merchantEximRoutes;
