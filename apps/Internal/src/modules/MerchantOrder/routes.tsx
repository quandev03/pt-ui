import { lazy } from 'react';
import { pathRoutes } from '../../constants/routes';
import { RouterConfig } from '../../routers/ProtectedRoute';
import { ActionsTypeEnum, ActionType } from '@react/constants/app';
import { ACTION_MODE_ENUM } from '@react/commons/types';
const MerchantOrderPage = lazy(() => import('./pages/index'));
const AddView = lazy(() => import('./pages/AddView'));

const merchantOrderRoutes: RouterConfig[] = [
  {
    path: pathRoutes.merchantOrderList,
    page: <MerchantOrderPage />,
  },
  {
    path: pathRoutes.merchantOrderAdd,
    page: <AddView actionType={ActionType.ADD} />,
  },
  {
    path: pathRoutes.merchantOrderView(),
    page: <AddView actionType={ActionType.VIEW} />,
  },
  {
    path: pathRoutes.merchantOrderCopy(),
    page: <AddView actionType={ActionsTypeEnum.COPY} />,
  },
];

export default merchantOrderRoutes;
