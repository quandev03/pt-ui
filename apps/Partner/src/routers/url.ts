export type IStringNumber = string | number;

export const pathRoutes = {
  home: '/',
  welcome: '/welcome',
  profile: '/profile',
  login: '/login',
  forgotPassword: '/forgot-password',
  notFound: '/not-found',

  // Quản trị hệ thống
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
  freeEsimBooking: `/free-esim-booking`,
  freeEsimBookingAdd: `/free-esim-booking/add`,
  freeEsimBookingView: (id?: IStringNumber) =>
    `/free-esim-booking/view/${id ? id : ':id'}`,
  buyBundleWithEsimAdd: `/buy-bundle-with-esim/add`,
  buyBundleWithEsimView: (id?: IStringNumber) =>
    `/buy-bundle-with-esim/view/${id ? id : ':id'}`,
};
