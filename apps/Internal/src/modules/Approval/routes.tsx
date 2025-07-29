import { lazy } from 'react';
import { pathRoutes } from '../../constants/routes';
import { RouterConfig } from '../../routers/ProtectedRoute';
import { ACTION_MODE_ENUM } from '@react/commons/types';
const ApprovalPage = lazy(() => import('./pages/index'));
const ViewPage = lazy(() => import('./pages/View'));

const approvalRoutes: RouterConfig[] = [
  {
    path: pathRoutes.approval,
    page: <ApprovalPage />,
  },
  {
    path: pathRoutes.approvalView(),
    page: <ViewPage actionMode={ACTION_MODE_ENUM.VIEW} />,
  },
];

export default approvalRoutes;
