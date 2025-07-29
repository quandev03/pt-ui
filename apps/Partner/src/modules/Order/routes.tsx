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
    path: pathRoutes.addOrder,
    page: <ActionOrder />,
  },
  {
    path: pathRoutes.viewOrder(),
    page: <ActionOrder />,
  },
  {
    path: pathRoutes.viewOrder(),
    page: <ActionOrder />,
  },

  {
    path: pathRoutes.copyOrder(),
    page: <ActionOrder />,
  },
];

export default orderRoutes;
