import { lazy } from 'react';
import { pathRoutes } from '../../constants/routes';
import { RouterConfig } from '../../routers/ProtectedRoute';
import { ActionType } from '@react/constants/app';

const Page = lazy(() => import('./pages'));
const ActionPage = lazy(() => import('./pages/ActionPage'));

const routesExportNumberPartner: RouterConfig[] = [
  {
    path: pathRoutes.exportNumberPartner,
    page: <Page />,
  },
  {
    path: pathRoutes.exportNumberPartnerAdd,
    page: <ActionPage typeModal={ActionType.ADD} />,
  },
  {
    path: pathRoutes.exportNumberPartnerView(),
    page: <ActionPage typeModal={ActionType.VIEW} />,
  },
];

export default routesExportNumberPartner;
