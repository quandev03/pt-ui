import { pathRoutes } from '../../constants/routes';
import { RouterConfig } from '../../routers/ProtectedRoute';
import ActivateEnterpriseH2HPage from '../ActivateSubscription/pages';

const authRoutes: RouterConfig[] = [
  {
    path: pathRoutes.enterpriseCustomerManagementH2HActive,
    page: <ActivateEnterpriseH2HPage />,
  },
];

export default authRoutes;
