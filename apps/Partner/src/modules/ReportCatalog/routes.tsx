import { pathRoutes } from 'apps/Partner/src/constants/routes';
import { RouterConfig } from 'apps/Partner/src/routers/ProtectedRoute';
import { lazy } from 'react';

const SubscriberTopUpReportPage = lazy(() => import('./page/SubscriberTopUpReport'));
const PackageSalesReportPage = lazy(() => import('./page/PackageSalesReport'));
const PackageResultReport = lazy(() => import('./page/PackageResultReport'));


const reportRoutes: RouterConfig[] = [
  {
    path: pathRoutes.subscriberTopUpReport,
    page: <SubscriberTopUpReportPage />,
  },
  {
    path: pathRoutes.packageSalesReport,
    page: <PackageSalesReportPage />,
  },
  {
    path: pathRoutes.reportPackageResult,
    page: <PackageResultReport />,
  },
];
export default reportRoutes;