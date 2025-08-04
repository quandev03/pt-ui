import { House, Settings } from 'lucide-react';
import { pathRoutes } from './url';
import { RouterItems } from '@vissoft-react/common';

export const routerItems: RouterItems[] = [
  {
    key: pathRoutes.home as string,
    icon: <House />,
    label: 'Tổng quan',
  },
  {
    key: pathRoutes.systemManager as string,
    icon: <Settings />,
    label: 'Quản trị hệ thống',
    hasChild: true,
  },
  // quản lý tài khoản
  {
    key: pathRoutes.accountAuthorization as string,
    label: 'Quản lý tài khoản',
    parentId: pathRoutes.systemManager,
  },
  {
    key: pathRoutes.systemUserManager as string,
    label: 'Tài khoản',
    parentId: pathRoutes.accountAuthorization as string,
  },
  {
    key: pathRoutes.object as string,
    label: 'Quản lý object',
    parentId: pathRoutes.accountAuthorization as string,
  },
  // Quản lý số
  {
    key: pathRoutes.manageNumber as string,
    label: 'Quản lý số',
    parentId: pathRoutes.systemManager as string,
  },
  {
    key: pathRoutes.lookupNumber as string,
    label: 'Tra cứu số',
    parentId: pathRoutes.manageNumber as string,
  },
  {
    key: pathRoutes.groupUserManager as string,
    label: 'Nhóm tài khoản',
    parentId: pathRoutes.accountAuthorization as string,
  },
  {
    key: pathRoutes.roleManager as string,
    label: 'Vai trò & Phân quyền',
    parentId: pathRoutes.accountAuthorization as string,
  },
  {
    key: pathRoutes.rolePartnerManager as string,
    label: 'Vai trò & Phân quyền đối tác',
    parentId: pathRoutes.accountAuthorization as string,
  },
];

export const singlePopActions = ['add'];
export const doublePopActions = ['edit', 'view'];
export const specialActions = [];
