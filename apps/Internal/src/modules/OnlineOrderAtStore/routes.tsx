import { lazy } from 'react';
import { pathRoutes } from '../../constants/routes';
import { RouterConfig } from '../../routers/ProtectedRoute';
const OrderAtStore = lazy(() => import('./pages/ListOrders'));


const orderAtStoreRoutes: RouterConfig[] = [
    {
        path: pathRoutes.onlineOrderAtStore,
        page: <OrderAtStore />
    },
];

export default orderAtStoreRoutes;
