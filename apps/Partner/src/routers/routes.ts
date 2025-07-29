import warehouseManagementRoutes from '../modules/ListOfDepartment/routes';
import orderRoutes from '../modules/Order/routes';
import userRoutes from '../modules/UserManagement/routes';
import serialLookupRoutes from '../modules/SerialLookup/routes';
import orgTransferRoutes from '../modules/OrganizationTransfer/routes';
import topUpSubscriptionRoutes from '../modules/TopUpSubscription/routes';
import { RouterConfig } from './ProtectedRoute';
import sellBatchPackage from '../modules/SellBatchPackage/routes';
import sellSinglePackage from '../modules/SellSinglePackage/routes';
import partnerCreditLimitsRoutes from '../modules/PartnerCreditLimits/router';
import inventoryDetailRoutes from '../modules/InventoryDetail/routes';
import kitUncraftRoutes from '../modules/KitUncraft/routes';
import kitCraftRoutes from '../modules/KitCraft/routes';
import lookupNumberRoutes from '../modules/LookupNumber/routes';
import ActivateSubscriptionRoutes from 'apps/Partner/src/modules/ActivateSubscription/routes';
import reportRoutes from '../modules/ReportCatalog/routes';
import luckyNumberRoutes from '../modules/LuckyNumber/routes';
import topupAssignPackageRoutes from '../modules/TopupAssignPackage/routes';
import simReplacementRoutes from '../modules/SimReplacement/routes';
export const routes: RouterConfig[] = [
  ...ActivateSubscriptionRoutes,
  ...orderRoutes,
  ...userRoutes,
  ...serialLookupRoutes,
  ...warehouseManagementRoutes,
  ...orgTransferRoutes,
  ...sellBatchPackage,
  ...sellSinglePackage,
  ...topUpSubscriptionRoutes,
  ...lookupNumberRoutes,
  ...partnerCreditLimitsRoutes,
  ...kitUncraftRoutes,
  ...kitCraftRoutes,
  ...reportRoutes,
  ...inventoryDetailRoutes,
  ...luckyNumberRoutes,
  ...topupAssignPackageRoutes,
  ...simReplacementRoutes,
];
