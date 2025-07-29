import { lazy } from 'react';
import { RouterConfig } from '../../routers/ProtectedRoute';
import { pathRoutes } from '../../constants/routes';
import { ActionType } from '@react/constants/app';
const AddPage = lazy(() => import('./pages/add'));
const Page = lazy(() => import('./pages'));
const routers: RouterConfig[] = [
  {
    path: pathRoutes.airtimeBonusTransactionPartnerAdd,
    page: <AddPage isEnabledApproval={false} typeModal={ActionType.ADD} />,
  },
  {
    path: pathRoutes.airtimeBonusTransactionPartnerView(),
    page: <AddPage isEnabledApproval={false} typeModal={ActionType.VIEW} />,
  },
  {
    path: pathRoutes.airtimeBonusTransactionPartner,
    page: <Page />,
  },
];
export default routers;
