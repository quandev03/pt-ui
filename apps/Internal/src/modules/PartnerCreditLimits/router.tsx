import { lazy } from 'react';
import { pathRoutes } from '../../constants/routes';
import { RouterConfig } from '../../routers/ProtectedRoute';

const DebtAdjustment = lazy(() => import('./pages/DebtAdjustment'));
const PartnerCreditLimitsList = lazy(() => import('./pages/List'));
const CreditLimitsDebt = lazy(() => import('./pages/CreditLimitsDebt'));
const PartnerCreditLimitsAction = lazy(
  () => import('./pages/PartnerCreditLimitsAction')
);

const PartnerCreditLimitsRoutes: RouterConfig[] = [
  {
    path: pathRoutes.partnerCreditLimits,
    page: <PartnerCreditLimitsList />,
  },
  {
    path: pathRoutes.partnerCreditLimitsAdd,
    page: <PartnerCreditLimitsAction />,
  },
  {
    path: pathRoutes.partnerCreditLimitsView(),
    page: <PartnerCreditLimitsAction />,
  },
  {
    path: pathRoutes.partnerCreditLimitsEdit(),
    page: <PartnerCreditLimitsAction />,
  },
  {
    path: pathRoutes.partnerCreditLimitsDebt(),
    page: <CreditLimitsDebt />,
  },
  {
    path: pathRoutes.partnerDebtAdjustment(),
    page: <DebtAdjustment />,
  },
];

export default PartnerCreditLimitsRoutes;
