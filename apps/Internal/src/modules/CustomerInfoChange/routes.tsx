import { pathRoutes } from '../../constants/routes';
import { RouterConfig } from '../../routers/ProtectedRoute';
import ActivateSubscriptionPage from './pages';

const authRoutes: RouterConfig[] = [
  {
    path: pathRoutes.customerInfoChange,
    page: <ActivateSubscriptionPage />,
  },
];

export default authRoutes;
