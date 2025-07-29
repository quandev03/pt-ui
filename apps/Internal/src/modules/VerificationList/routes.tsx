import { lazy } from 'react';
import { RouterConfig } from '../../routers/ProtectedRoute';
import { pathRoutes } from '../../constants/routes';

const Page = lazy(() => import('./page'));
const PageStaff = lazy(() => import('./page/verifiationListForStaff'));
const PageViewCensor = lazy(() => import('./page/censorshipRequestView'));
const PageEditCensor = lazy(() => import('./page/censorshipRequestEdit'));
const PageViewHistory = lazy(() => import('./page/docUpdateHistoryView'));
const PageEditHistory = lazy(() => import('./page/docUpdateHistoryEdit'));
const routes: RouterConfig[] = [
  {
    path: pathRoutes.verificationList,
    page: <Page />,
  },
  {
    path: pathRoutes.verificationListStaff,
    page: <PageStaff />,
  },
  {
    path: pathRoutes.verification_approve(),
    page: <PageViewCensor />,
  },
  {
    path: pathRoutes.verification_approve_edit(),
    page: <PageEditCensor />,
  },
  {
    path: pathRoutes.censorship_history_view(),
    page: <PageViewHistory />,
  },
  {
    path: pathRoutes.censorship_history_edit(),
    page: <PageEditHistory />,
  },
];
export default routes;
