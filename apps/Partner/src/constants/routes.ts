type ParamsType = string | number;
export const pathRoutes = {
  welcome: '/welcome',
  login: '/login',
  forgotPassword: '/forgot-password',
  dashboard: '/dashboard',
  subscriberActivation: '/customer/after-sale/activate-subscription',
  profile: '/profile',
  updatePassword: '/change-password',

  //Quản Trị Hệ Thống
  account_authorization: 'account-authorization',
  // User
  userManager: '/user-manager',
  userManagerAdd: '/user-manager/add',
  userManagerEdit: (id?: ParamsType) => `/user-manager/edit/${id ? id : ':id'}`,
  userManagerView: (id?: ParamsType) => `/user-manager/view/${id ? id : ':id'}`,
  //========== Quản lý kho ==========
  warehouseManagement: '/warehouse-management',
  warehouseManagementAdd: '/warehouse-management/add',
  warehouseManagementEdit: (id?: ParamsType) =>
    `/warehouse-management/edit/${id ? id : ':id'}`,
  warehouseManagementView: (id?: ParamsType) =>
    `/warehouse-management/view/${id ? id : ':id'}`,
  // Order
  orderList: '/order-list',
  addOrder: '/order-list/add',
  viewOrder: (id?: ParamsType) => `/order-list/view/${id ? id : ':id'}`,
  copyOrder: (id?: ParamsType) => `/order-list/copy/${id ? id : ':id'}`,
  // Search serial
  serialLookup: '/serial-inventory-search',
  // Xem thông tin kho
  inventoryDetail: '/inventory-detail',

  //Organization
  organizationTransfer: '/organization-transfer',
  addOrganizationTransfer: '/organization-transfer/add',
  viewOrganizationTransfer: (id = '') =>
    `/organization-transfer/view/${id ? id : ':id'}`,
  // Hạn mức đối tác
  partnerCreditLimits: '/partner-limits',

  //ghep kit
  kitManagement: 'kit-management',
  kitCraft: '/kit-craft',
  kitCraftList: '/kit-list',
  kitCraftView: (id = ':id') => `/kit-craft/view/${id}`,
  kitCraftGroupView: (id = ':id') => `/kit-craft/view-group/${id}`,
  kitCraftSingle: '/kit-craft-single',
  kitCraftBatch: '/kit-craft-batch',

  //huy ghep kit
  kitUncraft: '/kit-uncraft',
  kitUncraftAdd: '/kit-uncraft/add',

  //nap tien thue bao
  topUpSubscription: '/top-up-subscription',
  //  Bán gói đơn lẻ cho thuê bao & Bán gói theo lô cho thuê bao
  sellBatchPackage: '/sell-batch-package',
  sellSinglePackage: '/sell-single-package',

  // Tra cứu số
  lookupNumber: '/lookup-number',

  //Nghiệp vụ bán hàng
  after_sale: 'after-sale',
  activateSubscription: '/activate-subscription',

  // Báo cáo nạp tiền cho thuê bao
  subscriberTopUpReport: '/subscriber-top-up-report',
  // Báo cáo nạp tiền cho thuê bao
  packageSalesReport: '/package-sales-report',
  // Báo cáo bán gói theo lô
  reportPackageResult: '/report-package-result',
  luckyNumber: '/lucky-number',
  // Nạp tiền và gán gói trừ TKC
  topupAssignPackage: '/topup-assign-package',
  topupAssignPackageAdd: '/topup-assign-package/add',
  // Đổi sim hàng loạt
  simReplacement: '/sim-replacement',
  simReplacementDetail: (id = ':id') =>
    `/sim-replacement/view/${id ? id : ':id'}`,
  simReplacementAdd: '/sim-replacement/add',
};
