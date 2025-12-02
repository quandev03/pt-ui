export type IStringNumber = string | number;

export const pathRoutes = {
  home: '/',
  welcome: '/welcome',
  profile: '/profile',
  login: '/login',
  forgotPassword: '/forgot-password',
  notFound: '/not-found',
  dashboard: '/dashboard',
  // Quản trị hệ thống
  accountAuthorization: '/account-authorization',
  userManager: '/user-management',
  userManagerAdd: '/user-management/add',
  userManagerEdit: (id?: IStringNumber) =>
    `/user-management/edit/${id ? id : ':id'}`,
  userManagerView: (id?: IStringNumber) =>
    `/user-management/view/${id ? id : ':id'}`,
  roleManager: '/role-manager',
  roleManagerAdd: '/role-manager/add',
  roleManagerEdit: (id?: IStringNumber) =>
    `/role-manager/edit/${id ? id : ':id'}`,
  roleManagerView: (id?: IStringNumber) =>
    `/role-manager/view/${id ? id : ':id'}`,
  auditLog: '/audit-log',
  updateSubscriberInfo: '/subscriber-info-registration',
  agencyList: '/partner_configuration',
  agencyAdd: '/partner_configuration/add',
  agencyView: (id?: IStringNumber) =>
    `/partner_configuration/view/${id ? id : ':id'}`,
  agencyEdit: (id?: IStringNumber) =>
    `/partner_configuration/edit/${id ? id : ':id'}`,
  freeEsimBooking: `/free-esim-booking`,
  freeEsimBookingAdd: `/free-esim-booking/add`,
  freeEsimBookingView: (id?: IStringNumber) =>
    `/free-esim-booking/view/${id ? id : ':id'}`,
  buyBundleWithEsimAdd: `/buy-bundle-with-esim/add`,
  buyBundleWithEsimView: (id?: IStringNumber) =>
    `/buy-bundle-with-esim/view/${id ? id : ':id'}`,
  esimWarehouse: '/esim-warehouse',
  esimWarehouseAdd: '/esim-warehouse/add',
  esimWarehouseView: (id?: IStringNumber) =>
    `esim-warehouse/view/${id ? id : ':id'}`,
  roomService: '/room-service',
  roomServiceAdd: '/room-service/add',
  roomServiceEdit: (id?: IStringNumber) =>
    `/room-service/edit/${id ? id : ':id'}`,
  roomServiceView: (id?: IStringNumber) =>
    `/room-service/view/${id ? id : ':id'}`,
  roomPayment: '/room-payments',
  roomPaymentDetail: (id?: IStringNumber) =>
    `/room-payments/${id ? id : ':id'}`,
  report: `/report`,
  partnerOrderReport: `/partner-order-report`,
  saleManagement: '/sale-management',
  salePackage: '/sell-bundle-for-existing-sub',
  salePackageAddSingle: '/sell-bundle-for-existing-sub/single',
  salePackageAddBulk: '/sell-bundle-for-existing-sub/bulk',
  buyPackageService: '/buy-package-service',
  buyPackageServiceAdd: '/buy-package-service/add',
  advertisementManagement: '/advertisement-management',
  advertisementManagementAdd: '/advertisement-management/add',
  advertisementManagementEdit: (id?: IStringNumber) =>
    `/advertisement-management/edit/${id ? id : ':id'}`,
  advertisementManagementView: (id?: IStringNumber) =>
    `/advertisement-management/view/${id ? id : ':id'}`,
  contractManagement: '/contract-management',
  contractManagementAdd: '/contract-management/add',
  contractManagementDetail: (id?: IStringNumber) =>
    `/contract-management/${id ? id : ':id'}`,
};
