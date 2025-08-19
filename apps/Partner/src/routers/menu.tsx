import { House, Settings, Store } from 'lucide-react';
import { RouterItems } from '@vissoft-react/common';
import {
  ChartLine,
  ClipboardList,
  ShoppingCart,
  UserRoundCog,
} from 'lucide-react';
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
  {
    key: pathRoutes.updateSubscriberInfo as string,
    label: 'Cập nhật thông tin thuê bao',
    parentId: pathRoutes.saleManagement as string,
  },
  {
    key: pathRoutes.saleManagement as string,
    icon: <ShoppingCart />,
    label: 'Quản lý bán hàng',
    hasChild: true,
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
  {
    key: pathRoutes.report as string,
    label: 'Báo cáo',
    hasChild: true,
    icon: <ClipboardList />,
  },
  {
    key: pathRoutes.partnerOrderReport as string,
    label: 'Báo cáo đơn hàng book eSIM',
    parentId: pathRoutes.report as string,
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
