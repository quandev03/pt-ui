import { House, Settings, Store } from 'lucide-react';
import { pathRoutes } from './url';
import { RouterItems } from '@vissoft-react/common';

export const routerItems: RouterItems[] = [
  {
    key: pathRoutes.home as string,
    icon: <House />,
    label: 'Tổng quan',
  },
  {
    key: pathRoutes.accountAuthorization as string,
    icon: <Settings />,
    label: 'Quản Trị Hệ Thống',
    hasChild: true,
  },
  {
    key: pathRoutes.roleManager as string,
    label: 'Vai trò & Phân quyền',
    parentId: pathRoutes.accountAuthorization as string,
  },
  {
    key: pathRoutes.systemUserManager as string,
    label: 'Tài khoản',
    parentId: pathRoutes.accountAuthorization as string,
  },
  {
    key: pathRoutes.saleManagement as string,
    icon: <Store />,
    label: 'Quản Lý Bán Hàng',
    hasChild: true,
  },
  {
    key: pathRoutes.salePackage as string,
    label: 'Bán gói cho thuê bao hiện hữu',
    parentId: pathRoutes.saleManagement as string,
  },
];

export const singlePopActions = ['add'];
export const doublePopActions = ['edit', 'view'];
export const specialActions = [];
