import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { RouterConfig } from 'apps/Internal/src/routers/ProtectedRoute';
import { lazy } from 'react';
import SubscriberTopUpReportPage from './page/SubscriberTopUpReport';
import RechargeReport from './page/RechargeReport';

const ReportInventory = lazy(() => import('./page/ReportInventory'));
const OnlineOrderDetailReport = lazy(
  () => import('./page/OnlineOrderDetailReport')
);
const InventoryImportReport = lazy(
  () => import('./page/InventoryImportReport')
);
const InventoryExportReport = lazy(
  () => import('./page/InventoryExportReport')
);
const ReportOnPackagePurchase = lazy(
  () => import('./page/ReportOnPackagePurchase')
);
const PartnerOrderReport = lazy(() => import('./page/PartnerOrderReport'));
const PackageSalesReport = lazy(() => import('./page/PackageSalesReport'));
const PromotionSummaryReport = lazy(
  () => import('./page/PromotionSummaryReport')
);
const PromotionDetailReport = lazy(
  () => import('./page/PromotionDetailReport')
);
const ShippingReport = lazy(() => import('./page/ShippingReport'));
const ShippingReportDetail = lazy(() => import('./page/ShippingReportDetail'));

const reportRoutes: RouterConfig[] = [
  {
    path: pathRoutes.reportInventory,
    page: <ReportInventory />,
  },
  {
    path: pathRoutes.inventorExportReport,
    page: <InventoryExportReport />,
  },
  {
    path: pathRoutes.inventorImportReport,
    page: <InventoryImportReport />,
  },
  {
    path: pathRoutes.orderOnlineDetailReport,
    page: <OnlineOrderDetailReport />,
  },
  {
    path: pathRoutes.packageSalesReport,
    page: <PackageSalesReport />,
  },
  {
    path: pathRoutes.reportOnPackagePurchase,
    page: <ReportOnPackagePurchase />,
  },
  {
    path: pathRoutes.partnerOrderReport,
    page: <PartnerOrderReport />,
  },
  {
    path: pathRoutes.promotionSummaryReport,
    page: <PromotionSummaryReport />,
  },
  {
    path: pathRoutes.promotionDetailReport,
    page: <PromotionDetailReport />,
  },
  {
    path: pathRoutes.shippingReport,
    page: <ShippingReport />,
  },
  {
    path: pathRoutes.shippingReportDetail(':id'),
    page: <ShippingReportDetail />,
  },
  {
    path: pathRoutes.subscriberTopUpReport,
    page: <SubscriberTopUpReportPage />,
  },
  {
    path: pathRoutes.rechargeReport,
    page: <RechargeReport />,
  },
];
export default reportRoutes;
