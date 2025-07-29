type ParamsType = string | number;
export const pathRoutes = {
  welcome: '/welcome',
  login: '/login',
  dashboard: '/home',
  signPdf: '/sign-pdf',
  forgotPassword: '/forgot-password',
  profile: '/profile',
  subscriberActivation: '/subscriber-activation',

  auditLog: '/audit-log',
  accessLog: '/access-log',

  //Quản Trị Hệ Thống
  account_authorization: 'account-authorization',
  //===========
  userManager: '/user-manager',
  userManagerAdd: '/user-manager/add',
  userManagerEdit: (id?: ParamsType) => `/user-manager/edit/${id ? id : ':id'}`,
  userManagerView: (id?: ParamsType) => `/user-manager/view/${id ? id : ':id'}`,
  userPartnerManager: '/partner-user-manager',
  userPartnerManagerAdd: '/partner-user-manager/add',
  group_user_manager: '/group-manager',
  group_user_manager_add: '/group-manager/add',
  groupUserManagerEdit: (id?: ParamsType) =>
    `/group-manager/edit/${id ? id : ':id'}`,
  groupUserManagerView: (id?: ParamsType) =>
    `/group-manager/view/${id ? id : ':id'}`,
  role_manager: '/role-manager',
  role_manager_add: '/role-manager/add',
  roleManagerEdit: (id?: ParamsType) => `/role-manager/edit/${id ? id : ':id'}`,
  roleManagerView: (id?: ParamsType) => `/role-manager/view/${id ? id : ':id'}`,

  object: '/object-manager',
  object_add: '/object-manager/add',
  object_edit: (id = ':id') => `/object-manager/edit/${id}`,
  object_view: (id = ':id') => `/object-manager/view/${id}`,

  role_partner_manager: '/partner-role-manager',
  role_partner_manager_add: '/partner-role-manager/add',
  rolePartnerManagerEdit: (id?: ParamsType) =>
    `/partner-role-manager/edit/${id ? id : ':id'}`,
  rolePartnerManagerView: (id?: ParamsType) =>
    `/partner-role-manager/view/${id ? id : ':id'}`,
  //============

  // Kinh doanh
  business: 'business',

  //Quản lý danh mục
  category: '/category',
  areaCatalog: '/area-catalog',

  //==========
  listOfDepartment: '/unit-catalog',
  listOfDepartmentAdd: '/unit-catalog/add',
  listOfDepartmentEdit: (id?: ParamsType) =>
    `/unit-catalog/edit/${id ? id : ':id'}`,
  listOfDepartmentView: (id?: ParamsType) =>
    `/unit-catalog/view/${id ? id : ':id'}`,
  //=========
  supplier: '/supplier-catalog',
  supplier_add: '/supplier-catalog/add',
  supplier_edit: (id?: ParamsType) =>
    `/supplier-catalog/edit/${id ? id : ':id'}`,
  supplier_view: (id?: ParamsType) =>
    `/supplier-catalog/view/${id ? id : ':id'}`,
  //========= Partner catalog
  partnerCatalog: '/partner-catalog',
  partnerCatalogAdd: '/partner-catalog/add',
  partnerCatalogEdit: (id?: ParamsType) =>
    `/partner-catalog/edit/${id ? id : ':id'}`,
  partnerCatalogView: (id?: ParamsType) =>
    `/partner-catalog/view/${id ? id : ':id'}`,
  partnerCatalogUserManagement: (orgCode = ':orgCode') =>
    `/partner-catalog/user-management/${orgCode}`,
  partnerCatalogUserAdd: (orgCode = ':orgCode') =>
    `/partner-catalog/user-management/${orgCode}/add`,
  partnerCatalogUserEdit: (orgCode = ':orgCode', id = ':id') =>
    `/partner-catalog/user-management/${orgCode}/edit/${id}`,
  partnerCatalogUserView: (orgCode = ':orgCode', id = ':id') =>
    `/partner-catalog/user-management/${orgCode}/view/${id}`,
  //==========
  distributor: '/distributor',
  distributor_add: '/distributor/add',
  list_of_service_package: '/list-of-service-package',
  list_of_service_package_add: '/list-of-service-package/add',
  list_of_service_package_edit: (id?: ParamsType) =>
    `/list-of-service-package/edit/${id ? id : ':id'}`,
  list_of_service_package_view: (id?: ParamsType) =>
    `/list-of-service-package/view/${id ? id : ':id'}`,
  packageAuthorization: (id?: ParamsType) =>
    `/list-of-service-package/package-authorization/${id ? id : ':id'}`,
  //==========

  //Quản Trị Hệ Thống
  system_administration: 'system-administration',
  //=========

  //Quản lý gói cước
  package_manager: '/package-manager',
  //=================
  //==================
  category_reason: '/reason-catalog',
  category_reason_add: '/reason-catalog/add',
  category_reason_edit: (id?: ParamsType) =>
    `/reason-catalog/edit/${id ? id : ':id'}`,
  category_reason_view: (id?: ParamsType) =>
    `/reason-catalog/view/${id ? id : ':id'}`,
  //==================
  category_profile: '/profile-catalog',
  category_profile_add: '/profile-catalog/add',
  category_profile_edit: (id?: ParamsType) =>
    `/profile-catalog/edit/${id ? id : ':id'}`,
  category_profile_view: (id?: ParamsType) =>
    `/profile-catalog/view/${id ? id : ':id'}`,
  //==============

  //Danh mục bán hàng
  sales_directory: '/sales-directory',
  //=============
  category_product: '/category-product',
  category_product_add: '/category-product/add',
  category_product_edit: (id?: ParamsType) =>
    `/category-product/edit/${id ? id : ':id'}`,
  category_product_view: (id?: ParamsType) =>
    `/category-product/view/${id ? id : ':id'}`,
  //============
  productCatalog: '/product-catalog',
  productCatalogAdd: '/product-catalog/add',
  productCatalogEdit: (id = ':id') => `/product-catalog/edit/${id}`,
  productCatalogView: (id = ':id') => `/product-catalog/view/${id}`,
  //===========
  productGroupAdd: '/product-catalog/add-group',
  productGroupEdit: (id = ':id') => `/product-catalog/edit-group/${id}`,
  productGroupView: (id = ':id') => `/product-catalog/view-group/${id}`,

  //==========
  //Quản lý khuyến mại
  promotionProgram: '/promotion-program',
  discount: '/discount',
  discountAdd: '/discount/add',
  discountEdit: (id?: ParamsType) => `/discount/edit/${id ? id : ':id'}`,
  discountView: (id?: ParamsType) => `/discount/view/${id ? id : ':id'}`,

  //Kinh Doanh
  //========
  browsing: 'browsing',
  config_approval: '/config-approval',
  config_approval_add: '/config-approval/add',
  config_approval_edit: (id = ':id') => `/config-approval/edit/${id}`,
  config_approval_view: (id = ':id') => `/config-approval/view/${id}`,
  //=======
  approval: '/approval',
  approvalView: (id = ':id') => `/approval/view/${id}`,
  //=======
  phoneNoManagement: '/phone-no-management',
  //Dịch Vụ Khách Hàng
  customer: 'customer',
  //=======
  after_sale: 'after-sale',
  sale: 'sale',
  //=======
  activateSubscription: '/activate-subscription',
  subscriberOwnershipTransfer: '/subscriber-ownership-transfer',
  listOfRequestsChangeSim: '/list-of-requests-change-sim',
  listOfRequestsChangeSimAdd: '/list-of-requests-change-sim/add',
  listOfRequestsChangeSimView: (id?: ParamsType) =>
    `/list-of-requests-change-sim/view/${id ? id : ':id'}`,
  // Quản lý cấu hình kích hoạt
  configurationManagement: '/configuration-management',
  //Tra cứu thông tin
  searchInfo: '/search-info',

  //QUAN LY KHACH HANG DOANH NGHIEP
  businessManagement: '/business-management',
  businessManagementAdd: '/business-management/add',
  businessManagementEdit: (id?: ParamsType) =>
    `/business-management/edit/${id ? id : ':id'}`,
  businessManagementView: (id?: ParamsType) =>
    `/business-management/view/${id ? id : ':id'}`,
  enterpriseCustomerManagement: '/enterprise-customer-management',
  enterpriseCustomerManagementH2HActive:
    '/enterprise-customer-management-h2h-active',
  enterpriseCustomerManagementM2MActive:
    '/enterprise-customer-management-m2m-active',
  subscriberImpactReport: '/subscriber-impact-report',
  representativeAdd: (enterpriseId = ':enterpriseId') =>
    `/business-management/add-representative/${enterpriseId}`,
  representativeView: (id = ':id') =>
    `/business-management/view-representative/${id}`,
  representativeEdit: (id = ':id') =>
    `/business-management/edit-representative/${id}`,
  enterpriseHistory: (id = ':id') => `/business-management/view-history/${id}`,
  enterpriseHistoryDetail: (id = ':id') =>
    `/business-management/view-history-detail/${id}`,

  subscriberEnterpriseView: (id = ':id') =>
    `/business-management/view-subscriber/${id}`,
  //=======
  searchSubscription: '/search-subscription-admin',
  searchSubscriptionView: (id = ':id') =>
    `/search-subscription-admin/view/${id}`,
  searchSubscriptionImpactHistory: (id = ':id') =>
    `/search-subscription-admin/impact-history/${id}`,
  searchSubscriptionPackageHistory: (id = ':id') =>
    `/search-subscription-admin/package-history/${id}`,
  searchSubscriptionPackageCapacity: (id = ':id') =>
    `/search-subscription-admin/package-capacity/${id}`,
  searchSubscriptionSmsHistory: (id = ':id') =>
    `/search-subscription-admin/sms-history/${id}`,

  searchSubscriptionStaff: '/search-subscription-staff',
  searchSubscriptionStaffView: (id = ':id') =>
    `/search-subscription-staff/view/${id}`,
  searchSubscriptionStaffImpactHistory: (id = ':id') =>
    `/search-subscription-staff/impact-history/${id}`,
  searchSubscriptionStaffPackageHistory: (id = ':id') =>
    `/search-subscription-staff/package-history/${id}`,
  searchSubscriptionStaffPackageCapacity: (id = ':id') =>
    `/search-subscription-staff/package-capacity/${id}`,
  searchSubscriptionStaffSmsHistory: (id = ':id') =>
    `/search-subscription-staff/sms-history/${id}`,

  subscriberNoImpact: '/subscriber-no-impact',
  subscriberImpactByFile: '/subscriber-no-impact/by-file',

  //========
  documentManagement: '/document-management',
  //DANH SACH TIEN KIEM - CTV
  activationRequestList: '/activation-request-list',
  activationRequestListCreate: '/activation-request-list/add',
  activationRequestListEdit: (id = ':id') =>
    `/activation-request-list/edit/${id}`,
  activationRequestListView: (id = ':id') =>
    `/activation-request-list/view/${id}`,
  //=======
  // DANH SACH PHAN CONG TIEN KIEM - ADMIN
  activationAssignedList: '/assigned-activation',
  // DANH SACH TIEN KIEM - USER TIEN KIEM
  activationApproveList: '/approve-activation',
  activationApproveListView: (id = ':id') => `/approve-activation/view/${id}`,

  distributorAdd: '/distributor/add',
  approval_view: (id = ':id') => `/business/browsing/approval/view/${id}`,
  orderManagement: '/order-manager',
  unitManagement: '/unit-manager',
  debtManager: '/debt-manager',
  lookupNumber: '/lookup-number',

  // Quản lý kho
  inventoryManagement: '/inventory-management',
  // Xem thông tin kho
  inventoryDetail: '/inventory-detail',

  inventoryTransfer: '/inventory-transfer',

  //Quản lý cấu hình
  configManagementCustomer: '/customer-config',
  customerReasonList: '/customer-reason-catalog',
  customerReasonAdd: '/customer-reason-catalog/add',
  customerReasonEdit: (id?: ParamsType) =>
    `/customer-reason-catalog/edit/${id ? id : ':id'}`,
  customerReasonView: (id?: ParamsType) =>
    `/customer-reason-catalog/view/${id ? id : ':id'}`,

  //Quản lý cấu hình tham số hệ thống
  configSystemParamList: '/config-param-system',
  configSystemParamAdd: '/config-param-system/add',
  configSystemParamView: (id = ':id') => `/config-param-system/view/${id}`,
  configSystemParamEdit: (id = ':id') => `/config-param-system/edit/${id}`,

  // Quản lý hồ sơ
  verificationList: '/censorship-assign',
  verificationListStaff: '/subdocument-staff',
  verification_approve: (id = ':id') => `/subdocument-staff/view/${id}`,
  verification_approve_edit: (id = ':id') => `/subdocument-staff/edit/${id}`,
  censorship_history_view: (id?: ParamsType) =>
    `/subdocument-staff/history-view/${id ? id : ':id'}`,
  censorship_history_edit: (id?: ParamsType) =>
    `/subdocument-staff/history-edit/${id ? id : ':id'}`,
  //====== Danh sách hậu kiểm
  post_check_list: '/post-check-list',
  post_check_list_view: (id?: ParamsType) =>
    `/post-check-list/view/${id ? id : ':id'}`,
  // ====== Upload tài nguyên số
  uploadNumber: '/upload-number',
  uploadNumberView: (id?: string | number) =>
    `/upload-number/view/${id ? id : ':id'}`,
  uploadNumberAdd: '/upload-number/add',

  // Quản lý số
  numberManagement: '/number-management',

  //===== Điều chuyển số
  transferNumber: '/transfer-number',
  transferNumberAdd: '/transfer-number/add',
  transferNumberView: (id?: ParamsType) =>
    `/transfer-number/view/${id ? id : ':id'}`,

  //===== Thu hồi số
  revokeNumber: '/revoke-number',
  revokeNumberAdd: '/revoke-number/add',
  revokeNumberView: (id?: ParamsType) =>
    `/revoke-number/view/${id ? id : ':id'}`,

  //===== Phân phối số
  distributeNumber: '/distribute-number',
  distributeNumberAdd: '/distribute-number/add',
  distributeNumberView: (id: number | string = ':id') =>
    `/distribute-number/view/${id}`,

  //==== Gán số đặc biệt
  classifySpecialNumber: '/classify-special-number',
  classifySpecialNumberAdd: '/classify-special-number/add',
  classifySpecialNumberView: (id?: ParamsType) =>
    `/classify-special-number/view/${id ? id : ':id'}`,

  // === Xuất số cho đối tác
  exportNumberPartner: '/export-number-partner',
  exportNumberPartnerAdd: '/export-number-partner/add',
  exportNumberPartnerView: (id?: ParamsType) =>
    `/export-number-partner/view/${id ? id : ':id'}`,

  //===== Số đầu số
  numberPrefix: '/number-prefix',
  numberPrefixAdd: '/number-prefix/add',
  numberPrefixEdit: (id = ':id') => `/number-prefix/edit/${id}`,
  numberPrefixView: (id = ':id') => `/number-prefix/view/${id}`,

  //===== đối tác
  agentManager: '/agent-manager',

  // Quản lý xuất nhập kho
  inventoryEximManagement: '/inventory-exim-management',
  // Quản lý xuất nhập kho cua NCC
  merchantEximTransList: '/merchant-exim-transaction',
  merchantEximTransAddIm: '/merchant-exim-transaction/add-import',
  merchantEximTransView: (id = ':id') =>
    `/merchant-exim-transaction/view/${id}`,
  //=== Tạo GD Nhập khác
  importTransaction: '/import-transaction',
  //=== Tạo GD xuất khác
  exportTransaction: '/export-transaction',
  exportTransactionView: (id = ':id') => `/export-transaction/view/${id}`,

  //ghep kit
  kitManagement: 'kit-management',
  kitCraft: '/kit-craft',
  kitCraftList: '/kit-list',
  kitCraftView: (id = ':id') => `/kit-craft/view/${id}`,
  kitCraftGroupView: (id = ':id') => `/kit-craft/view-group/${id}`,
  kitCraftSingle: '/kit-craft-single',
  kitCraftBatch: '/kit-craft-batch',

  //kit-uncraft
  kitUncraft: '/kit-uncraft',
  kitUncraftAdd: '/kit-uncraft/add',

  //Xuất nhập hàng với NCC
  merchant: 'merchant',
  merchantOrderList: '/merchant-order-list',
  merchantOrderAdd: '/merchant-order-list/add',
  merchantOrderView: (id = ':id') => `/merchant-order-list/view/${id}`,
  merchantOrderCopy: (id = ':id') => `/merchant-order-list/copy/${id}`,

  //Quản lý phiếu xuất nhập
  merchantEximNote: '/merchant-exim-note',
  merchantEximAddIm: '/merchant-exim-note/add-import',
  merchantEximViewIm: (id = ':id') => `/merchant-exim-note/view-import/${id}`,

  // Warehouse
  warehouseManagement: 'warehouse-management',
  stockOut: '/stock-out',
  stockIn: '/stock-in',
  //
  //  phiếu xuất cho đối tác
  stockOutForDistributor: '/stock-out-for-distributor',
  stockOutForDistributorAdd: '/stock-out-for-distributor/add',
  stockOutForDistributorView: (id?: ParamsType) =>
    `/stock-out-for-distributor/view/${id ? id : ':id'}`,
  // Quản lý sim
  simManagement: '/sim-management',
  // =====
  simUpload: '/sim-upload',
  // simUploadAdd
  simUploadAdd: '/sim-upload/add',
  // simUploadView
  simUploadView: (id?: ParamsType) => `/sim-upload/view/${id ? id : ':id'}`,

  serialLookup: '/serial-inventory-search',

  // SIM upload form
  uploadSimForm: '/upload-sim-form',
  viewUploadSimForm: (id?: ParamsType) =>
    `/upload-sim-form/view/${id ? id : ':id'}`,
  addUploadSimForm: '/upload-sim-form/add',

  // Xuất nhập với NPP
  eximDistributor: '/exim-distributor',
  //====
  eximDistributorTransactionList: '/exim-distributor-transaction-list',
  eximDistributorTransactionAdd: '/exim-distributor-transaction-list/add',
  eximDistributorTransactionView: (id?: ParamsType) =>
    `/exim-distributor-transaction-list/view/${id ? id : ':id'}`,

  // Danh mục kho số
  phoneNoCatalog: '/number-catalog',
  phoneNoCatalogAdd: '/number-catalog/add',
  phoneNoCatalogEdit: (id?: ParamsType) =>
    `/number-catalog/edit/${id ? id : ':id'}`,
  phoneNoCatalogView: (id?: ParamsType) =>
    `/number-catalog/view/${id ? id : ':id'}`,
  // Đối tác
  partnerManagement: '/partner-management',
  // quản lý đơn hàng
  orderList: '/order-management',
  viewOrder: (id?: string | number) =>
    `/order-management/view/${id ? id : ':id'}`,
  // Quản lý hạn mức đối tác
  partnerCreditLimits: '/partner-limits',
  partnerCreditLimitsAdd: '/partner-limits/add',
  partnerCreditLimitsView: (id = ':id') => `/partner-limits/view/${id}`,
  partnerCreditLimitsEdit: (id = ':id') =>
    `/partner-limits/edit/${id ? id : ':id'}`,
  partnerCreditLimitsDebt: (id = ':id') =>
    `/partner-limits/debt-detail/${id ? id : ':id'}`,
  partnerDebtAdjustment: (id = ':id') =>
    `/partner-limits/debt-adjustment/${id ? id : ':id'}`,
  // Đổi sim hàng loạt
  simReplacement: '/sim-replacement',
  simReplacementDetail: (id = ':id') =>
    `/sim-replacement/view/${id ? id : ':id'}`,
  simReplacementAdd: '/sim-replacement/add',
  beginningInventory: '/beginning-inventory',
  //Quản lí Xuất nhập nội bộ
  internalEximManagement: '/internal-exim-management',

  // Lập phiếu xuất kho nội bộ
  internalWarehouseDeliveryNote: '/internal-warehouse-delivery-note',
  internalExportWarehouseDeliveryNoteAdd:
    '/internal-warehouse-delivery-note/add-export',
  internalWarehouseDeliveryNoteView: (id = ':id') =>
    `/internal-warehouse-delivery-note/view/${id}`,
  internalImportWarehouseDeliveryNoteAdd:
    '/internal-warehouse-delivery-note/add-import',
  internalImportWarehouseDeliveryNoteView: (id = ':id') =>
    `/internal-warehouse-delivery-note/view-import/${id}`,

  //Quản lí Xuất nhập nội bộ
  internalExportProposal: '/internal-export-proposal',
  internalExportProposalAdd: '/internal-export-proposal/add',
  internalExportProposalView: (id = ':id') =>
    `/internal-export-proposal/view/${id}`,
  internalExportProposalCopy: (id = ':id') =>
    `/internal-export-proposal/copy/${id}`,
  internalImportExportWarehouse: '/internal-import-export-warehouse',
  internalImportWarehouseAdd: '/internal-import-export-warehouse/add-import',
  internalExportWarehouseAdd: '/internal-import-export-warehouse/add-export',
  internalImportWarehouseView: (id = ':id') =>
    `/internal-import-export-warehouse/view-import/${id}`,
  internalExportWarehouseView: (id = ':id') =>
    `/internal-import-export-warehouse/view-export/${id}`,
  internalExportProposalReceive: '/internal-export-proposal-receive',
  internalExportProposalReceiveView: (id = ':id') =>
    `/internal-export-proposal-receive/view/${id}`,

  // Quản lý yêu cầu phản ánh
  feedback: '/feedback',
  feedbackCSKH: '/feedback-cskh',
  feedbackBO: '/feedback-bo',
  feedbackAssigned: '/feedback-assigned',
  feedbackRouteAdd: (prefix: string) => `${prefix}/add`,
  feedbackRouteView: (prefix: string, id = ':id') => `${prefix}/view/${id}`,
  feedbackRouteEdit: (prefix: string, id = ':id') => `${prefix}/edit/${id}`,

  // Quản lý phí vận chuyện
  // --- CTKM vận chuyển
  deliveryFeeManagement: 'delivery-fee',
  deliveryPromotionscategory: '/delivery-promotion-category',
  deliveryPromotionscategoryAdd: '/delivery-promotion-category/add',
  deliveryPromotionscategoryEdit: (id?: ParamsType) =>
    `/delivery-promotion-category/edit/${id ? id : ':id'}`,
  deliveryPromotionscategoryView: (id?: ParamsType) =>
    `/delivery-promotion-category/view/${id ? id : ':id'}`,
  // --- Danh mục phí vận chuyển
  deliveryFeecategory: '/delivery-fee-category',
  deliveryFeecategoryAdd: '/delivery-fee-category/add',
  deliveryFeecategoryEdit: (id?: ParamsType) =>
    `/delivery-fee-category/edit/${id ? id : ':id'}`,
  deliveryFeecategoryView: (id?: ParamsType) =>
    `/delivery-fee-category/view/${id ? id : ':id'}`,

  // Tra cứu giao dịch xuất
  transactionSearchImportExport: '/transaction-search-import-export',
  transactionSearchExportView: (id = ':id') =>
    `/transaction-search-import-export/view/export-other-way/${id ?? ':id'}`,
  transactionSearchImportView: (id = ':id') =>
    `/transaction-search-import-export/view/import-other-way/${id ?? ':id'}`,
  transactionSearchInternalExportView: (id = ':id') =>
    `/transaction-search-import-export/view/internal-export/${id ?? ':id'}`,
  transactionSearchInternalImportView: (id = ':id') =>
    `/transaction-search-import-export/view/internal-import/${id ?? ':id'}`,
  transactionSearchMerchantEximView: (id = ':id') =>
    `/transaction-search-import-export/view/merchant-exim/${id ?? ':id'}`,
  transactionSearchInternalExportEximDistributor: (id = ':id') =>
    `/transaction-search-import-export/view/exim-distributor-transaction/${id ?? ':id'
    }`,
  transactionSearchExportKitView: (id = ':id') =>
    `/transaction-search-import-export/view/export-kit/${id ?? ':id'}`,
  transactionSearchImportKitView: (id = ':id') =>
    `/transaction-search-import-export/view/import-kit/${id ?? ':id'}`,
  transactionSearchExportSimView: (id = ':id') =>
    `/transaction-search-import-export/view/export-sim/${id ?? ':id'}`,
  transactionSearchImportSimView: (id = ':id') =>
    `/transaction-search-import-export/view/import-sim/${id ?? ':id'}`,
  // Quản lý khách hàng doanh nghiệp
  // ======================== Danh mục NVKD/AM
  catalogSaleandAM: '/catalog-sale-am',
  catalogSaleAMAddSale: '/catalog-sale-am/add-sale',
  catalogSaleAMAddAM: '/catalog-sale-am/add-am',

  // --- Danh mục loại phản ánh
  reflectionCategory: '/reflection-category',
  reflectionCategoryAdd: '/reflection-category/add',
  reflectionCategoryEdit: (id?: ParamsType) =>
    `/reflection-category/edit/${id ? id : ':id'}`,
  reflectionCategoryView: (id?: ParamsType) =>
    `/reflection-category/view/${id ? id : ':id'}`,
  // Danh sách đơn hàng online CS
  onlineOrderCS: '/online-order-cs',
  // khóa kì
  cycleLock: '/cycle-lock',

  // --- Cấu hình tham số
  parameterConfig: '/parameter-configuration',
  parameterConfigAdd: '/parameter-configuration/add',
  parameterConfigEdit: (id?: ParamsType) =>
    `/parameter-configuration/edit/${id ? id : ':id'}`,
  parameterConfigView: (id?: ParamsType) =>
    `/parameter-configuration/view/${id ? id : ':id'}`,
  shippingConfigurations: '/shipping-configurations',

  //Quản lý đơn hàng online
  onlineOrders: '/online-order-management',
  onlineOrdersEdit: (id?: ParamsType) =>
    `/online-order-management/edit/${id ? id : ':id'}`,
  onlineOrdersView: (id?: ParamsType) =>
    `/online-order-management/view/${id ? id : ':id'}`,
  // Quản lý tài khoản airtime đối tác
  managePartnerAirtimeAccount: '/manage-partner-airtime-account',
  airtimeBonusTransactionPartner: '/airtime-bonus-transaction-partner',
  airtimeBonusTransactionPartnerAdd: '/airtime-bonus-transaction-partner/add',

  airtimeBonusTransactionPartnerView: (id?: ParamsType) =>
    `/airtime-bonus-transaction-partner/view/${id ? id : ':id'}`,
  //Quản lý đơn hàng nhận tại cửa hàng
  onlineOrderAtStore: '/online-order-at-store',

  //QL cấu hình - Lịch sử CTKM
  promotionHistory: '/promotion-history',
  // Báo cáo
  reports: '/customer-service-reports',
  promotionHistoryAdd: '/promotion-history/add',
  promotionHistoryEdit: (id?: ParamsType) =>
    `/promotion-history/edit/${id ? id : ':id'}`,
  promotionHistoryView: (id?: ParamsType) =>
    `/promotion-history/view/${id ? id : ':id'}`,

  // Báo cáo KD
  reportsKd: 'REPORTS_KD',
  reportInventory: '/report-inventory',
  inventorExportReport: '/inventory-export-report',
  inventorImportReport: '/inventory-import-report',
  orderOnlineDetailReport: '/order-online-detail-report',
  packageSalesReport: '/package-sales-report',
  reportOnPackagePurchase: '/report-on-package-purchase',
  partnerOrderReport: '/partner-order-report',
  promotionSummaryReport: '/promotion-summary-report',
  promotionDetailReport: '/promotion-detail-report',
  shippingReport: '/shipping-report',
  shippingReportDetail: (id = ':id') => `/shipping-report/view/${id}`,
  subscriberTopUpReport: '/subscriber-top-up-report',
  rechargeReport: '/recharge-report',

  // Báo cáo DVKH
  reportCensorship: '/report-censorship',
  reportPreCheck: '/precheck-report',
  reportAgency: '/agency-report',
  reportPostCheck: '/postcheck-report',
  reportCriteria: '/criteria-report',
  reportActivate: '/activate-report',
  reportChangeSim: '/change-sim-report',
  reportFeedback: '/feedback-report',
  //  Phân hệ Quản lý mã khuyến mại
  managementPromotionProgramBusiness: '/promotion-program-business-management',
  promotionProgramBusiness: '/promotion-program-business',
  promotionProgramBusinessAdd: '/promotion-program-business/add',
  promotionProgramBusinessEdit: (id?: ParamsType) =>
    `/promotion-program-business/edit/${id ? id : ':id'}`,
  promotionProgramBusinessView: (id?: ParamsType) =>
    `/promotion-program-business/view/${id ? id : ':id'}`,

  //thay đổi thông tin khách hàng
  customerInfoChange: '/customer-change-info',

  // Quản lý kênh bán lẻ
  channelManagement: '/channel-management',

  //Chương trình khuyến mãi
  promotionRestManagement: '/promotion-rest',
  promotionRestAdd: '/promotion-rest/add',
  promotionRestEdit: (id?: ParamsType) =>
    `/promotion-rest/edit/${id ? id : ':id'}`,
  promotionRestView: (id?: ParamsType) =>
    `/promotion-rest/view/${id ? id : ':id'}`,

  // Coverage Area Management routes
  coverageAreaManager: '/coverage-area-manager',
  coverageAreaManagerAdd: '/coverage-area-manager/add',
  coverageAreaManagerEdit: (id?: ParamsType) =>
    `/coverage-area-manager/edit/${id ? id : ':id'}`,
  coverageAreaManagerView: (id?: ParamsType) =>
    `/coverage-area-manager/view/${id ? id : ':id'}`,
};
