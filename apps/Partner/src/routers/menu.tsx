import { ChartNoAxesGantt, House, Settings } from 'lucide-react';
import { pathRoutes } from './url';
import { RouterItems } from '@vissoft-react/common';

export const routerItems: RouterItems[] = [
  {
    key: pathRoutes.home as string,
    icon: <House />,
    label: 'Tổng quan',
  },
  {
    key: pathRoutes.dashboard as string,
    label: 'Tổng quan',
    icon: <ChartNoAxesGantt />,
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
    key: pathRoutes.userManager as string,
    label: 'Quản lý user đại lý',
    parentId: pathRoutes.accountAuthorization as string,
  },
  {
    key: pathRoutes.agencyList as string,
    label: 'Cấu hình đại lý',
    parentId: pathRoutes.accountAuthorization as string,
  },
  {
    key: pathRoutes.freeEsimBooking as string,
    label: 'Book eSIM miễn phí',
  },
  {
    key: pathRoutes.buyBundleWithEsim as string,
    label: 'Book eSIM kèm gói',
  },
];

export const singlePopActions = ['add'];
export const doublePopActions = ['edit', 'view'];
export const specialActions = [];
