import { lazy } from 'react';
import { RouterConfig } from '../../routers/ProtectedRoute';
import { pathRoutes } from '../../constants/routes';

const Page = lazy(() => import('./page'));
const PageAdd = lazy(() => import('./page/add'));
const PageView = lazy(() => import('./page/view'));

const routes: RouterConfig[] = [
  {
    path: pathRoutes.eximDistributorTransactionList,
    page: <Page />,
  },
  {
    path: pathRoutes.eximDistributorTransactionAdd,
    page: <PageAdd />,
  },
  {
    path: pathRoutes.eximDistributorTransactionView(),
    page: <PageView />,
  },
];

export default routes;
