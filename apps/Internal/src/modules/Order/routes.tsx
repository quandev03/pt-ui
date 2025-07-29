import { lazy } from 'react';
import { pathRoutes } from '../../constants/routes';
import { RouterConfig } from '../../routers/ProtectedRoute';

const OrderList = lazy(() => import('./pages/OrderList'));
const ActionOrder = lazy(() => import('./pages/ActionOrder'));

const orderRoutes: RouterConfig[] = [
  {
    path: pathRoutes.orderList,
    page: <OrderList />,
  },
  {
    path: pathRoutes.viewOrder(),
    page: <ActionOrder />,
  },
];

export default orderRoutes;
