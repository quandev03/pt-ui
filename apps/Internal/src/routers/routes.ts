import ActivateSubscriptionRoutes from 'apps/Internal/src/modules/ActivateSubscription/routes';
import approvalRoutes from 'apps/Internal/src/modules/Approval/routes';
import CategoryProductRoutes from 'apps/Internal/src/modules/CategoryProduct/routes';
import configApprovalRoutes from 'apps/Internal/src/modules/ConfigApproval/routes';
import DistributorRoutes from 'apps/Internal/src/modules/Distributor/routes';
import GeographicCoverageManagementRoutes from 'apps/Internal/src/modules/GeographicCoverageManagement/routes';
import ListOfDepartmentRoutes from 'apps/Internal/src/modules/ListOfDepartment/routes';
import ListOfServicePackageRoutes from 'apps/Internal/src/modules/ListOfServicePackage/routes';
import ProductCatalogRoutes from 'apps/Internal/src/modules/ProductCatalog/routes';
import roleRoutes from 'apps/Internal/src/modules/RoleManagement/routes';
import SupplierRoutes from 'apps/Internal/src/modules/Supplier/routes';
import transactionSearchImportExportRoutes from 'apps/Internal/src/modules/TransactionSearchImportExport/routes';
import UserGroupManagementRoutes from 'apps/Internal/src/modules/UserGroupManagement/routes';
import UserManagementRoutes from 'apps/Internal/src/modules/UserManagement/routes';
import ActivateEnterpriseH2HPage from '../modules/ActivateH2HEnterprise/routes';
import ActivateEnterpriseM2MPage from '../modules/ActivateM2MEnterprise/routes';
import ActivationApproveList from '../modules/ActivationApprovedList/routes';
import ActivationAssignedList from '../modules/ActivationAssignedList/routes';
import ActivationRequestList from '../modules/ActivationRequestList/routes';
import AirtimeBonusTransactionPartner from '../modules/AirtimeBonusTransactionPartner/routes';
import AreaCatalog from '../modules/AreaCatalog/routes';
import logRoutes from '../modules/AudiLog/routes';
import BeginningInventoryRoutes from '../modules/BeginningInventory/routes';
import BusinessManagementRoutes from '../modules/BusinessManagement/routes';
import CategoryProfile from '../modules/CategoryProfile/routes';
import CategoryReasonRoutes from '../modules/CatrgoryReason/routes';
import routesClassifySpecialNumber from '../modules/ClassifySpecialNumber/routes';
import ConfigSystemParamRoutes from '../modules/ConfigSystemParam/routes';
import ConfigurationManagementRoutes from '../modules/ConfigurationManagement/routes';
import CustomerInfoChange from '../modules/CustomerInfoChange/routes';
import CustomerReasonConfig from '../modules/CustomerReasonConfig/routes';
import DashboardRoutes from '../modules/Dashboard/routes';
import DeliveryFeeCategory from '../modules/DeliveryFeeCategory/routes';
import DeliveryProgramPromotion from '../modules/DeliveryProgramPromotion/routes';
import DiscountSaga from '../modules/Discount/routes';
import routesDistributeNumber from '../modules/DistributeNumber/routes';
import CatalogSaleandAM from '../modules/EnterpriseCatalogSaleAM/routes';
import EximDistributorTransaction from '../modules/EximDistributorList/routes';
import routesExportNumberPartner from '../modules/ExportNumberPartner/routes';
import Feedback from '../modules/Feedback/routes';
import importExportTransactionOtherWayRoutes from '../modules/ImportExportTransactionOtherWay/routes';
import InternalExportProposalReceiveRoutes from '../modules/InternalExportProposalReceive/routes';
import InternalExportProposalRoutes from '../modules/InternalExportProposalSend/routes';
import InternalExportWarehouseDeliveryNoteRoutes from '../modules/InternalExportWarehouseDeliveryNote/routes';
import InternalImportExportWarehouseRoutes from '../modules/InternalImportExportWarehouse/routes';
import InternalImportWarehouseDeliveryNoteRoutes from '../modules/InternalImportWarehouseDeliveryNoteImport/routes';
import InventoryDetail from '../modules/InventoryDetail/routes';
import kitCraftRoutes from '../modules/KitCraft/routes';
import kitUncraftRoutes from '../modules/KitUncraft/routes';
import ListOfRequestsChangeSimRoutes from '../modules/ListOfRequestsChangeSim/routes';
import LockPeriodRoutes from '../modules/LockPeriod/routes';
import routesLookupNumber from '../modules/LookupNumber/routes';
import ManagePartnerAirtimeAccountRoutes from '../modules/ManagePartnerAirtimeAccount/routes';
import MerchantExim from '../modules/MerchantEximNote/routes';
import MerchantEximTrans from '../modules/MerchantEximTrans/routes';
import MerchantOrder from '../modules/MerchantOrder/routes';
import ObjectRouters from '../modules/ObjectManagement/routes';
import orderAtStoreRoutes from '../modules/OnlineOrderAtStore/routes';
import orderCSRoutes from '../modules/OnlineOrderCS/routes';
import OnlineOrdersSaga from '../modules/OnlineOrders/routes';
import orderRoutes from '../modules/Order/routes';
import PackageAuthorizationRoutes from '../modules/PackageAuthorization/routes';
import ParameterConfig from '../modules/ParameterConfig/routes';
import partnerCatalogRoutes from '../modules/PartnerCatalog/routes';
import PartnerCreditLimitsRoutes from '../modules/PartnerCreditLimits/router';
import PhoneNoCatalogRoutes from '../modules/PhoneNoCatalog/routes';
import PhoneNoManagementPrefix from '../modules/PhoneNoManagementPrefix/routes';
import PostCheckListRoutes from '../modules/PostCheckList/routes';
import PromotionHistory from '../modules/PromotionHistory/routes';
import PromotionProgramBusinessRoutes from '../modules/PromotionProgramBusiness/routes';
import PromotionRest from '../modules/PromotionRest/routes';
import ReflectionCategory from '../modules/ReflectionCategory/routes';
import ReportActivate from '../modules/ReportActivate/routes';
import reportRoutes from '../modules/ReportCatalog/routes';
import ReportCensorshipRoutes from '../modules/ReportCensorship/routes';
import ReportChangeSIM from '../modules/ReportChangeSIM/routes';
import ReportCriteria from '../modules/ReportCriteria/routes';
import ReportPostCheck from '../modules/ReportPostCheck/routes';
import ReportPrecheckRoutes from '../modules/ReportPrecheck/routes';
import ReportRegulatoryRoutes from '../modules/ReportRegulatory/routes';
import routesRevokeNumber from '../modules/RevokeNumber/routes';
import SearchSubscriptionRoutes from '../modules/SearchSubscription/routes';
import SerialLookup from '../modules/SerialLookup/routes';
import shippingConfigurationsRoutes from '../modules/ShippingConfigurations/routes';
import SimReplacementRoutes from '../modules/SimReplacement/routes';
import SimUploadFormRoutes from '../modules/SimUploadForm/routes';
import StockOutForDistributorRoutes from '../modules/StockOutForDistributor/routes';
import SubscriberImpactReport from '../modules/SubscriberImpactReport/routes';
import SubscriberOwnershipTransferRoutes from '../modules/SubscriberOwnershipTransfer/routes';
import routesTransferNumber from '../modules/TransferNumber/routes';
import routesUploadNumber from '../modules/UploadNumber/routes';
import UploadSim from '../modules/UploadSim/routes';
import userPartnerRoutes from '../modules/UserPartnerManagement/routes';
import VerificationListRoutes from '../modules/VerificationList/routes';
// import ExportNumberPartnerRoutes from '../modules/ExportNumberPartner/routes';
import { RouterConfig } from './ProtectedRoute';
import ReportFeedback from '../modules/ReportFeedback/routes';

export const mainRoutes: RouterConfig[] = [];

export const routes: RouterConfig[] = [
  ...DashboardRoutes,
  ...ActivateSubscriptionRoutes,
  ...roleRoutes,
  ...UserGroupManagementRoutes,
  ...UserManagementRoutes,
  ...ListOfDepartmentRoutes,
  ...ProductCatalogRoutes,
  ...SupplierRoutes,
  ...DistributorRoutes,
  ...ListOfServicePackageRoutes,
  ...PackageAuthorizationRoutes,
  ...CategoryProductRoutes,
  ...CategoryReasonRoutes,
  ...configApprovalRoutes,
  ...approvalRoutes,
  ...SearchSubscriptionRoutes,
  ...VerificationListRoutes,
  ...PostCheckListRoutes,
  ...PhoneNoManagementPrefix,
  ...ActivationRequestList,
  ...routesTransferNumber,
  ...routesRevokeNumber,
  ...routesUploadNumber,
  ...routesDistributeNumber,
  ...routesClassifySpecialNumber,
  ...CategoryProfile,
  ...importExportTransactionOtherWayRoutes,
  ...UploadSim,
  ...SerialLookup,
  ...kitCraftRoutes,
  ...ObjectRouters,
  ...PhoneNoCatalogRoutes,
  ...ActivationApproveList,
  ...ActivationAssignedList,
  ...StockOutForDistributorRoutes,
  ...orderRoutes,
  ...PartnerCreditLimitsRoutes,
  ...InternalExportProposalRoutes,
  ...EximDistributorTransaction,
  ...userPartnerRoutes,
  ...partnerCatalogRoutes,
  ...InventoryDetail,
  ...DiscountSaga,
  ...InternalExportProposalReceiveRoutes,
  ...InternalImportExportWarehouseRoutes,
  ...ConfigurationManagementRoutes,
  ...transactionSearchImportExportRoutes,
  ...InternalExportWarehouseDeliveryNoteRoutes,
  ...InternalImportWarehouseDeliveryNoteRoutes,
  ...MerchantOrder,
  ...MerchantExim,
  ...MerchantEximTrans,
  ...AreaCatalog,
  ...LockPeriodRoutes,
  ...ActivateEnterpriseH2HPage,
  ...CatalogSaleandAM,
  ...SimReplacementRoutes,
  ...ListOfRequestsChangeSimRoutes,
  ...BusinessManagementRoutes,
  ...ActivateEnterpriseM2MPage,
  ...SubscriberImpactReport,
  ...BeginningInventoryRoutes,
  ...reportRoutes,
  ...SimUploadFormRoutes,
  ...CustomerReasonConfig,
  ...shippingConfigurationsRoutes,
  ...Feedback,
  ...DeliveryProgramPromotion,
  ...DeliveryFeeCategory,
  ...kitUncraftRoutes,
  ...ManagePartnerAirtimeAccountRoutes,
  ...AirtimeBonusTransactionPartner,
  ...ReflectionCategory,
  ...ConfigSystemParamRoutes,
  ...ParameterConfig,
  ...routesLookupNumber,
  ...OnlineOrdersSaga,
  ...orderCSRoutes,
  ...orderAtStoreRoutes,
  ...routesExportNumberPartner,
  ...ReportCensorshipRoutes,
  ...ReportPrecheckRoutes,
  ...ReportRegulatoryRoutes,
  ...PromotionProgramBusinessRoutes,
  ...ReportPostCheck,
  ...ReportChangeSIM,
  ...ReportCriteria,
  ...ReportActivate,
  ...ReportFeedback,
  ...logRoutes,
  ...SubscriberOwnershipTransferRoutes,
  ...PromotionRest,
  ...PromotionHistory,
  ...CustomerInfoChange,
  ...logRoutes,
  ...PromotionRest,
  ...GeographicCoverageManagementRoutes,
  // ...ExportNumberPartnerRoutes,
];
