import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { RouterConfig } from 'apps/Internal/src/routers/ProtectedRoute';
import { lazy } from 'react';
import SmsHistoryPage from './pages/SmsHistory';

const Page = lazy(() => import('./pages'));
const ViewPage = lazy(() => import('./pages/view'));
const ImpactHistoryPage = lazy(() => import('./pages/ImpactHistory'));
const PackageHistoryPage = lazy(() => import('./pages/PackageHistory'));
const PackageCapacityPage = lazy(() => import('./pages/PackageCapacity'));
const SubscriberNoImpactPage = lazy(() => import('./pages/SubscriberNoImpact'));
const SubscriberImpactByFilePage = lazy(
  () => import('./pages/SubscriberImpactByFile')
);

const routes: RouterConfig[] = [
  {
    path: pathRoutes.searchSubscription,
    page: <Page />,
  },
  {
    path: pathRoutes.searchSubscriptionView(),
    page: <ViewPage />,
  },
  {
    path: pathRoutes.searchSubscriptionImpactHistory(),
    page: <ImpactHistoryPage />,
  },
  {
    path: pathRoutes.searchSubscriptionPackageHistory(),
    page: <PackageHistoryPage />,
  },
  {
    path: pathRoutes.searchSubscriptionPackageCapacity(),
    page: <PackageCapacityPage />,
  },
  {
    path: pathRoutes.searchSubscriptionSmsHistory(),
    page: <SmsHistoryPage />,
  },
  {
    path: pathRoutes.searchSubscriptionStaff,
    page: <Page />,
  },
  {
    path: pathRoutes.searchSubscriptionStaffView(),
    page: <ViewPage />,
  },
  {
    path: pathRoutes.searchSubscriptionStaffImpactHistory(),
    page: <ImpactHistoryPage />,
  },
  {
    path: pathRoutes.searchSubscriptionStaffPackageHistory(),
    page: <PackageHistoryPage />,
  },
  {
    path: pathRoutes.searchSubscriptionStaffPackageCapacity(),
    page: <PackageCapacityPage />,
  },
  {
    path: pathRoutes.searchSubscriptionStaffSmsHistory(),
    page: <SmsHistoryPage />,
  },
  {
    path: pathRoutes.subscriberNoImpact,
    page: <SubscriberNoImpactPage />,
  },
  {
    path: pathRoutes.subscriberImpactByFile,
    page: <SubscriberImpactByFilePage />,
  },
];

export default routes;
