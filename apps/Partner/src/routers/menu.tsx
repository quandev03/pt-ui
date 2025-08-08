import { ChartNoAxesGantt, House, Settings, Store } from 'lucide-react';
import { pathRoutes } from './url';
import { RouterItems } from '@vissoft-react/common';

export const routerItems: RouterItems[] = [
  {
    key: pathRoutes.home as string,
    label: 'Tổng quan',
  },
  {
    key: pathRoutes.dashboard as string,
    label: 'Tổng quan',
  },
  {
    key: pathRoutes.accountAuthorization as string,
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
    key: pathRoutes.saleManagement as string,
    label: 'Quản Lý Bán Hàng',
    hasChild: true,
  },
  {
    key: pathRoutes.freeEsimBooking as string,
    label: 'Book eSIM miễn phí',
    parentId: pathRoutes.saleManagement as string,
  },
  {
    key: pathRoutes.buyBundleWithEsim as string,
    label: 'Book eSIM kèm gói',
    parentId: pathRoutes.saleManagement as string,
  },
  {
    key: pathRoutes.esimWarehouse as string,
    label: 'Danh sách eSIM',
    parentId: pathRoutes.saleManagement as string,
  },
];

export const singlePopActions = ['add'];
export const doublePopActions = ['edit', 'view'];
export const specialActions = [];
