import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { RouterConfig } from 'apps/Internal/src/routers/ProtectedRoute';
import { lazy } from 'react';
import { ACTION_MODE_ENUM } from '@react/commons/types';
import { TypePage } from 'apps/Internal/src/modules/ImportExportTransactionOtherWay/type';
import { ActionType } from '@react/constants/app';

const TransactionSearchImportExport = lazy(() => import('./pages/index'));
const ExportTransaction = lazy(
  () => import('../ImportExportTransactionOtherWay/page')
);
const InternalExportTransaction = lazy(
  () => import('../InternalImportExportWarehouse/page/add')
);
const InternalImportTransaction = lazy(
  () => import('../InternalImportExportWarehouse/page/add')
);
const MerchantEximTrans = lazy(
  () => import('../MerchantEximTrans/pages/AddView')
);
const EximDistributorTransaction = lazy(
  () => import('../EximDistributorList/page/view')
);
const transactionSearchImportExportRoutes: RouterConfig[] = [
  {
    path: pathRoutes.transactionSearchImportExport,
    page: <TransactionSearchImportExport />,
  },
  {
    path: pathRoutes.transactionSearchExportView(),
    page: (
      <ExportTransaction
        actionMode={ACTION_MODE_ENUM.VIEW}
        type={TypePage.EXPORT}
      />
    ),
  },
  {
    path: pathRoutes.transactionSearchImportView(),
    page: (
      <ExportTransaction
        actionMode={ACTION_MODE_ENUM.VIEW}
        type={TypePage.IMPORT}
      />
    ),
  },
  {
    path: pathRoutes.transactionSearchExportKitView(),
    page: (
      <ExportTransaction
        actionMode={ACTION_MODE_ENUM.VIEW}
        type={TypePage.EXPORT_KIT}
      />
    ),
  },
  {
    path: pathRoutes.transactionSearchImportKitView(),
    page: (
      <ExportTransaction
        actionMode={ACTION_MODE_ENUM.VIEW}
        type={TypePage.IMPORT_KIT}
      />
    ),
  },
  {
    path: pathRoutes.transactionSearchInternalExportView(),
    page: (
      <InternalExportTransaction typeModal={ActionType.VIEW} isImport={false} />
    ),
  },
  {
    path: pathRoutes.transactionSearchInternalImportView(),
    page: (
      <InternalImportTransaction typeModal={ActionType.VIEW} isImport={true} />
    ),
  },
  {
    path: pathRoutes.transactionSearchMerchantEximView(),
    page: <MerchantEximTrans actionType={ActionType.VIEW} />,
  },
  {
    path: pathRoutes.transactionSearchInternalExportEximDistributor(),
    page: <EximDistributorTransaction />,
  },
  {
    path: pathRoutes.transactionSearchExportSimView(),
    page: (
      <ExportTransaction
        actionMode={ACTION_MODE_ENUM.VIEW}
        type={TypePage.EXPORT_SIM}
      />
    ),
  },
  {
    path: pathRoutes.transactionSearchImportSimView(),
    page: (
      <ExportTransaction
        actionMode={ACTION_MODE_ENUM.VIEW}
        type={TypePage.IMPORT_SIM}
      />
    ),
  },
];

export default transactionSearchImportExportRoutes;
