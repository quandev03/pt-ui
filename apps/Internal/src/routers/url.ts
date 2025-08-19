export type IStringNumber = string | number;

export type IPathRoutes = Record<
  string,
  string | ((id?: IStringNumber) => string)
>;

export interface ParamsType {
  id?: string | number;
}

export const pathRoutes = {
  home: '/',
  welcome: '/welcome',
  profile: '/profile',
  login: '/login',
  forgotPassword: '/forgot-password',
  notFound: '/not-found',

  // Quản lý tài khoản
  dashboard: '/dashboard',
  systemManager: '/system-manager',
  accountAuthorization: '/account-authorization',
  systemUserManager: '/user-manager',
  systemUserManagerAdd: '/user-manager/add',
  systemUserManagerEdit: (id?: IStringNumber) =>
    `/user-manager/edit/${id ? id : ':id'}`,
  systemUserManagerView: (id?: IStringNumber) =>
    `/user-manager/view/${id ? id : ':id'}`,
  roleManager: '/role-manager',
  roleManagerAdd: '/role-manager/add',
  roleManagerEdit: (id?: IStringNumber) =>
    `/role-manager/edit/${id ? id : ':id'}`,
  roleManagerView: (id?: IStringNumber) =>
    `/role-manager/view/${id ? id : ':id'}`,
  auditLog: '/audit-log',
  groupUserManager: '/group-user-manager',
  groupUserManagerAdd: '/group-user-manager/add',
  groupUserManagerEdit: (id?: IStringNumber) =>
    `/group-user-manager/edit/${id ? id : ':id'}`,
  groupUserManagerView: (id?: IStringNumber) =>
    `/group-user-manager/view/${id ? id : ':id'}`,
  object: '/object-manager',
  object_add: '/object-manager/add',
  object_edit: (id = ':id') => `/object-manager/edit/${id}`,
  object_view: (id = ':id') => `/object-manager/view/${id}`,
  rolePartnerManager: '/role-partner-manager',
  rolePartnerManagerAdd: '/role-partner-manager/add',
  rolePartnerManagerEdit: (id?: IStringNumber) =>
    `/role-partner-manager/edit/${id ? id : ':id'}`,
  rolePartnerManagerView: (id?: IStringNumber) =>
    `/role-partner-manager/view/${id ? id : ':id'}`,
  // Quản lý số
  manageNumber: '/manage-number',
  lookupNumber: '/lookup-number', //tra cứu số

  // Quản lý danh mục
  category: '/category',

  listOfServicePackage: '/list-of-service-package',
  listOfServicePackageAdd: '/list-of-service-package/add',
  listOfServicePackageEdit: (id?: IStringNumber) =>
    `/list-of-service-package/edit/${id ? id : ':id'}`,
  listOfServicePackageView: (id?: IStringNumber) =>
    `/list-of-service-package/view/${id ? id : ':id'}`,

  //========= Danh mục đối tác

  uploadNumber: '/upload-number',
  uploadNumberView: (id?: string | number) =>
    `/upload-number/view/${id ? id : ':id'}`,
  uploadNumberAdd: '/upload-number/add',

  //========= Danh mục đối tác
  partnerCatalog: '/partner-catalog',
  partnerCatalogAdd: '/partner-catalog/add',
  partnerCatalogEdit: (id?: IStringNumber) =>
    `/partner-catalog/edit/${id ? id : ':id'}`,
  partnerCatalogView: (id?: IStringNumber) =>
    `/partner-catalog/view/${id ? id : ':id'}`,
  partnerCatalogUserManagement: (orgCode = ':orgCode') =>
    `/partner-catalog/user-management/${orgCode}`,
  partnerCatalogUserAdd: (orgCode = ':orgCode') =>
    `/partner-catalog/user-management/${orgCode}/add`,
  partnerCatalogUserEdit: (orgCode = ':orgCode', id = ':id') =>
    `/partner-catalog/user-management/${orgCode}/edit/${id}`,
  partnerCatalogUserView: (orgCode = ':orgCode', id = ':id') =>
    `/partner-catalog/user-management/${orgCode}/view/${id}`,
  partnerCatalogAssignPackage: (id?: IStringNumber) =>
    `/partner-catalog/assign-package/${id ? id : ':id'}`,

  // Danh sách kho eSIM
  esimStock: '/esim-stock',

  //Quản lý bán hàng
  salesManager: '/sales-manager',
  eSIMStock: '/esim-stock',
  eSIMStockView: (id?: IStringNumber) => `/esim-stock/view/${id ? id : ':id'}`,
  // Báo cáo
  report: '/report',
  reportPartner: '/report-partner',
  reportPartnerView: (id?: IStringNumber) =>
    `/report-partner/view/${id ? id : ':id'}`,
};
