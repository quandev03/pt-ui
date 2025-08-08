import { BarChart3, House, Settings, ShoppingCart } from 'lucide-react';
import { pathRoutes } from './url';
import { RouterItems } from '@vissoft-react/common';

export const routerItems: RouterItems[] = [
  {
    key: pathRoutes.systemManager as string,
    icon: <Settings color="#000" />,
    label: 'Quản trị hệ thống',
    hasChild: true,
  },
  {
    key: pathRoutes.dashboard as string,
    label: 'Tổng quan',
    parentId: pathRoutes.systemManager,
  },
  // quản lý tài khoản
  {
    key: pathRoutes.accountAuthorization as string,
    label: 'Quản lý tài khoản',
    hasChild: true,
    parentId: pathRoutes.systemManager,
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
    parentId: pathRoutes.systemManager,
    hasChild: true,
  },
  {
    key: pathRoutes.list_of_service_package,
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
    parentId: pathRoutes.systemManager as string,
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
    label: 'Danh sách kho eSIM',
    parentId: pathRoutes.systemManager,
  },
  // Báo cáo

  {
    key: pathRoutes.report,
    label: 'Báo cáo',
    hasChild: true,
    parentId: pathRoutes.systemManager,
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
