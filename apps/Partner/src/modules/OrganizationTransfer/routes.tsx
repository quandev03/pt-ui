import { ActionType } from '@react/constants/app';
import { lazy } from 'react';
import { pathRoutes } from '../../constants/routes';
import { RouterConfig } from '../../routers/ProtectedRoute';
const OrganizationTransferPage = lazy(() => import('./pages/index'));
const AddView = lazy(() => import('./pages/AddView'));

const organizationTransferRoutes: RouterConfig[] = [
  {
    path: pathRoutes.organizationTransfer,
    page: <OrganizationTransferPage />,
  },
  {
    path: pathRoutes.addOrganizationTransfer,
    page: <AddView actionType={ActionType.ADD} />,
  },
  {
    path: pathRoutes.viewOrganizationTransfer(),
    page: <AddView actionType={ActionType.VIEW} />,
  },
];

export default organizationTransferRoutes;
