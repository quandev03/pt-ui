import { lazy } from 'react';
import { pathRoutes } from '../../constants/routes';
import { RouterConfig } from '../../routers/ProtectedRoute';
const SubscriptionPage = lazy(() => import('./pages'));

const TopUpSubscriptionRoutes: RouterConfig[] = [
  {
    path: pathRoutes.topUpSubscription,
    page: <SubscriptionPage />,
  },
];

export default TopUpSubscriptionRoutes;
