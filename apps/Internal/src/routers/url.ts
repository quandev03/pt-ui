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
};
