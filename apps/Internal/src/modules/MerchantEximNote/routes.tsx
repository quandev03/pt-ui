import { ActionType } from '@react/constants/app';
import { lazy } from 'react';
import { pathRoutes } from '../../constants/routes';
import { RouterConfig } from '../../routers/ProtectedRoute';

const MerchantEximPage = lazy(() => import('./pages/index'));
const AddView = lazy(() => import('./pages/AddView'));

const merchantEximRoutes: RouterConfig[] = [
  {
    path: pathRoutes.merchantEximNote,
    page: <MerchantEximPage />,
  },
  {
    path: pathRoutes.merchantEximAddIm,
    page: <AddView actionType={ActionType.ADD} isImport />,
  },
  {
    path: pathRoutes.merchantEximViewIm(),
    page: <AddView actionType={ActionType.VIEW} isImport />,
  },
];

export default merchantEximRoutes;
