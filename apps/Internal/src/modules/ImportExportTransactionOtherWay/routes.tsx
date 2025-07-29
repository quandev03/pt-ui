import { lazy } from 'react';
import { RouterConfig } from '../../routers/ProtectedRoute';
import { pathRoutes } from '../../constants/routes';
import { ACTION_MODE_ENUM } from '@react/commons/types';
import { TypePage } from 'apps/Internal/src/modules/ImportExportTransactionOtherWay/type';

const ExportTransaction = lazy(() => import('./page/index'));

const importExportTransactionOtherWayRoutes: RouterConfig[] = [
  {
    path: pathRoutes.exportTransaction,
    page: (
      <ExportTransaction
        actionMode={ACTION_MODE_ENUM.CREATE}
        type={TypePage.EXPORT}
      />
    ),
  },
  {
    path: pathRoutes.importTransaction,
    page: (
      <ExportTransaction
        actionMode={ACTION_MODE_ENUM.CREATE}
        type={TypePage.IMPORT}
      />
    ),
  },
];

export default importExportTransactionOtherWayRoutes;
