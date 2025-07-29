import { lazy } from 'react';
import { pathRoutes } from '../../constants/routes';
import { RouterConfig } from '../../routers/ProtectedRoute';

const CreditLimitsDebt = lazy(() => import('./pages/CreditLimitsDebt'));

const PartnerCreditLimitsRoutes: RouterConfig[] = [
  {
    path: pathRoutes.partnerCreditLimits,
    page: <CreditLimitsDebt view={true} />,
  },
];

export default PartnerCreditLimitsRoutes;
