import { lazy } from 'react';
import { pathRoutes } from '../../constants/routes';
import { RouterConfig } from '../../routers/ProtectedRoute';

const Page = lazy(() => import('./page'));
const PageAdd = lazy(() => import('./page/add'));
const PageEdit = lazy(() => import('./page/edit'));
const PageView = lazy(() => import('./page/view'));
const PageRepresentativesAdd = lazy(
  () =>
    import(
      './components/FormView/EnterpriseRepresentatives/pages/addRepresentative'
    )
);
const PageRepresentativesView = lazy(
  () => import('./components/FormView/EnterpriseRepresentatives/pages/view')
);
const PageRepresentativesEdit = lazy(
  () => import('./components/FormView/EnterpriseRepresentatives/pages/edit')
);
const PageEnterpriseHistory = lazy(
  () => import('./components/EnterpriseHistory/EnterpriseHistoryList')
);
const PageEnterpriseHistoryDetail = lazy(
  () => import('./components/EnterpriseHistory/EnterpriseHistoryDetail')
);
const PageViewSubscriber = lazy(
  () => import('./components/FormView/Subscriber/pages/view')
);
const routes: RouterConfig[] = [
  {
    path: pathRoutes.businessManagement,
    page: <Page />,
  },
  {
    path: pathRoutes.businessManagementAdd,
    page: <PageAdd />,
  },
  {
    path: pathRoutes.businessManagementEdit(),
    page: <PageEdit />,
  },
  {
    path: pathRoutes.businessManagementView(),
    page: <PageView />,
  },
  {
    path: pathRoutes.representativeAdd(),
    page: <PageRepresentativesAdd />,
  },
  {
    path: pathRoutes.representativeView(),
    page: <PageRepresentativesView />,
  },
  {
    path: pathRoutes.representativeEdit(),
    page: <PageRepresentativesEdit />,
  },
  {
    path: pathRoutes.enterpriseHistory(),
    page: <PageEnterpriseHistory />,
  },
  {
    path: pathRoutes.enterpriseHistoryDetail(),
    page: <PageEnterpriseHistoryDetail />,
  },
  {
    path: pathRoutes.subscriberEnterpriseView(),
    page: <PageViewSubscriber />,
  },
];

export default routes;
