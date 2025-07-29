import { lazy } from 'react';
import { pathRoutes } from '../../constants/routes';
import { RouterConfig } from '../../routers/ProtectedRoute';
const OrderCS = lazy(() => import('./pages/ListOrders'));


const orderCSRoutes: RouterConfig[] = [
    {
        path: pathRoutes.onlineOrderCS,
        page: <OrderCS />
    },
];

export default orderCSRoutes;
