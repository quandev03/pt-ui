import { RouterItems } from '@vissoft-react/common';
import {
  CardSim,
  ChartLine,
  FileDigit,
  LayoutList,
  NotebookPen,
  PencilLine,
  Users,
} from 'lucide-react';
import { pathRoutes } from './url';

export const routerItems: RouterItems[] = [
  {
    key: pathRoutes.dashboard as string,
    label: 'Dashboard',
    icon: <ChartLine />,
  },
  // quản lý tài khoản
  {
    key: pathRoutes.accountAuthorization as string,
    label: 'Người dùng',
    hasChild: true,
    icon: <Users />,
  },
  {
    key: pathRoutes.systemUserManager as string,
    label: 'Tài khoản',
    parentId: pathRoutes.accountAuthorization as string,
  },
  // Quản lý danh mục
  {
    key: pathRoutes.category,
    label: 'Hệ thống',
    icon: <LayoutList />,
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
    label: 'Hợp đồng',
    icon: <PencilLine />,
    hasChild: true,
  },
  {
    key: pathRoutes.uploadNumber,
    parentId: pathRoutes.manageNumber,
    label: 'Quản lý',
  },
  {
    key: pathRoutes.lookupNumber as string,
    label: 'Mẫu hợp đồng',
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
    icon: <CardSim />,
    label: 'Danh sách đăng ký dịch vụ',
  },
  {
    key: pathRoutes.eSIMStockAdd,
    label: 'Thêm đăng ký dịch vụ',
    hasChild: true,
  },
  {
    key: pathRoutes.updateSubscriberInfo as string,
    icon: <PencilLine />,
    label: 'Cập nhật thông tin thuê bao',
  },
   //Báo cáo
   
  {
    key: pathRoutes.reportPartner,
    label: 'Báo cáo đơn hàng đối tác',
    parentId: pathRoutes.report,
  },
];
export const singlePopActions = ['add'];
export const doublePopActions = ['edit', 'view'];
export const specialActions = [];
