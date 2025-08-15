import { RouterItems } from '@vissoft-react/common';
import { ChartLine, ChartNoAxesGantt, Settings, Store } from 'lucide-react';
import { pathRoutes } from './url';

export const routerItems: RouterItems[] = [
  {
    key: pathRoutes.home as string,
    label: 'Tổng quan',
  },
  {
    key: pathRoutes.dashboard as string,
    label: 'Tổng quan',
    icon: <ChartLine />,
  },
  {
    key: pathRoutes.accountAuthorization as string,
    label: 'Quản Trị Hệ Thống',
    hasChild: true,
    icon: <Settings />,
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
    key: pathRoutes.updateSubscriberInfo as string,
    label: 'Cập nhật thông tin thuê bao',
    parentId: pathRoutes.saleManagement as string,
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
    icon: <Store />,
  },
  {
    key: pathRoutes.freeEsimBooking as string,
    label: 'Đặt hàng eSIM',
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
