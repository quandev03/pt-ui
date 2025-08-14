import { RouterItems } from '@vissoft-react/common';
import { House, UserRoundCog } from 'lucide-react';
import { pathRoutes } from './url';

export const routerItems: RouterItems[] = [
  {
    key: pathRoutes.home as string,
    icon: <House />,
    label: 'Tổng quan',
  },
  {
    key: pathRoutes.accountAuthorization as string,
    icon: <UserRoundCog />,
    label: 'Quản Trị Hệ Thống',
    hasChild: true,
  },
  {
    key: pathRoutes.roleManager as string,
    label: 'Vai trò & Phân quyền',
    parentId: pathRoutes.accountAuthorization as string,
  },
  {
    key: pathRoutes.userManager as string,
    label: 'Quản lý user đại lý',
    parentId: pathRoutes.accountAuthorization as string,
  },
  {
    key: pathRoutes.agencyList as string,
    label: 'Danh sách đại lý',
    parentId: pathRoutes.accountAuthorization as string,
  },
];

export const singlePopActions = ['add'];
export const doublePopActions = ['edit', 'view'];
export const specialActions = [];
