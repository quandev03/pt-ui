import { BarChart3, House, ShoppingCart } from 'lucide-react';
import { RouterItems } from '@vissoft-react/common';
import { ChartNoAxesGantt, Settings, User, User2 } from 'lucide-react';
import { pathRoutes } from './url';

export const routerItems: RouterItems[] = [
  {
    key: pathRoutes.dashboard as string,
    label: 'Tổng quan',
  },
  // quản lý tài khoản
  {
    key: pathRoutes.accountAuthorization as string,
    label: 'Tài khoản và phân quyền',
    hasChild: true,
  },
  {
    key: pathRoutes.systemUserManager as string,
    label: 'Tài khoản',
    parentId: pathRoutes.accountAuthorization as string,
  },
  // Quản lý danh mục
  {
    key: pathRoutes.category,
    label: 'Quản lý danh mục',
    hasChild: true,
  },
  {
    key: pathRoutes.listOfServicePackage,
    label: 'Danh mục gói cước',
    parentId: pathRoutes.category,
  },
  {
    key: pathRoutes.partnerCatalog,
    label: 'Danh mục đối tác',
    parentId: pathRoutes.category,
  },

  // Quản lý số
  {
    key: pathRoutes.manageNumber as string,
    label: 'Quản lý số',
    hasChild: true,
  },
  {
    key: pathRoutes.uploadNumber,
    parentId: pathRoutes.manageNumber,
    label: 'Upload số',
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
  {
    key: pathRoutes.object as string,
    label: 'Quản lý object',
    parentId: pathRoutes.accountAuthorization as string,
  },
  // danh sách kho esim
  {
    key: pathRoutes.esimStock,
    label: 'Danh sách eSIM',
  },
  // Báo cáo

  {
    key: pathRoutes.report,
    label: 'Báo cáo',
    hasChild: true,
  },
  {
    key: pathRoutes.reportPartner,
    label: 'Báo cáo đơn hàng đối tác',
    parentId: pathRoutes.report,
  },

  {
    key: pathRoutes.salesManager as string,
    icon: <ShoppingCart />,
    label: 'Quản lý bán hàng',
    hasChild: true,
  },

  {
    key: pathRoutes.eSIMStock as string,
    label: 'Kho eSIM',
    parentId: pathRoutes.salesManager as string,
  },
  {
    key: pathRoutes.report as string,
    icon: <BarChart3 />,
    label: 'Báo cáo',
    hasChild: true,
  },

  {
    key: pathRoutes.reportPartner as string,
    label: 'Báo cáo đơn hàng đối tác',
    parentId: pathRoutes.report as string,
  },
];
export const singlePopActions = ['add'];
export const doublePopActions = ['edit', 'view'];
export const specialActions = [];
