import { lazy } from 'react';
import { pathRoutes } from '../../constants/routes';
import { RouterConfig } from '../../routers/ProtectedRoute';

const AudiLogList = lazy(() => import('./pages/AuditLogList'));
const AccessLog = lazy(() => import('./pages/AccessLog'));

const logRoutes: RouterConfig[] = [
  {
    path: pathRoutes.auditLog,
    page: <AudiLogList />,
  },
  {
    path: pathRoutes.accessLog,
    page: <AccessLog />,
  },
];

export default logRoutes;
