import { pathRoutes } from '../../constants/routes';
import { RouterConfig } from '../../routers/ProtectedRoute';
import ActivateSubscriptionPage from './pages';

const authRoutes: RouterConfig[] = [
  {
    path: pathRoutes.enterpriseCustomerManagementM2MActive,
    page: <ActivateSubscriptionPage />,
  },
];

export default authRoutes;
