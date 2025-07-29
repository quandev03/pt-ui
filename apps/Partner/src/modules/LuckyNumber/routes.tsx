import { lazy } from 'react';
import { pathRoutes } from '../../constants/routes';
import { RouterConfig } from '../../routers/ProtectedRoute';

const LuckyNumberPage = lazy(() => import('./page/index'));
const luckyNumberRoutes: RouterConfig[] = [
  {
    path: pathRoutes.luckyNumber,
    page: <LuckyNumberPage />,
  },
];
export default luckyNumberRoutes;
