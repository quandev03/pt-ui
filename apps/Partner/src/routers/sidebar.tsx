import {
  faLayerGroup,
  faMoneyBill,
  faMoneyBill1,
  faReorder,
  faSearchPlus,
  faStar,
  faUser,
  faWarehouse,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MenuItem } from '@react/commons/types';
import { pathRoutes } from '../constants/routes';

export const menuItems: MenuItem[] = [
  {
    key: pathRoutes.account_authorization,
    icon: <FontAwesomeIcon icon={faUser} />,
    label: 'Quản Trị Hệ Thống',
    hasChild: true,
  },
  {
    key: pathRoutes.userManager,
    label: 'Tài khoản',
    parentId: pathRoutes.account_authorization,
  },
  {
    key: pathRoutes.orderList,
    icon: <FontAwesomeIcon icon={faReorder} />,
    label: 'Quản lý đơn hàng',
  },
  {
    key: pathRoutes.serialLookup,
    label: 'Tra cứu Serial',
    icon: <FontAwesomeIcon icon={faSearchPlus} />,
  },
  {
    key: pathRoutes.partnerCreditLimits,
    icon: <FontAwesomeIcon icon={faMoneyBill} />,
    label: 'Quản lý công nợ',
  },
  {
    key: pathRoutes.warehouseManagement,
    icon: <FontAwesomeIcon icon={faWarehouse} />,
    label: 'Danh mục kho',
  },
  {
    key: pathRoutes.organizationTransfer,
    icon: <FontAwesomeIcon icon={faReorder} />,
    label: 'Điều chuyển hàng',
  },
  {
    key: pathRoutes.inventoryDetail,
    label: 'Xem thông tin kho',
    icon: <FontAwesomeIcon icon={faWarehouse} />,
  },
  // Quản lý KIT
  {
    key: pathRoutes.kitManagement,
    label: 'Quản lý KIT',
    icon: <FontAwesomeIcon icon={faReorder} />,
    hasChild: true,
  },
  {
    key: pathRoutes.kitCraft,
    label: 'Báo cáo ghép KIT',
    parentId: pathRoutes.kitManagement,
  },
  {
    key: pathRoutes.kitCraftSingle,
    label: 'Ghép KIT đơn lẻ',
    parentId: pathRoutes.kitManagement,
  },
  {
    key: pathRoutes.kitCraftBatch,
    label: 'Ghép KIT hàng loạt',
    parentId: pathRoutes.kitManagement,
  },
  {
    key: pathRoutes.kitCraftList,
    label: 'Danh sách KIT',
    parentId: pathRoutes.kitManagement,
  },
  {
    key: pathRoutes.kitUncraft,
    label: 'Hủy ghép KIT',
    parentId: pathRoutes.kitManagement,
  },
  /* ---------------------- nap tien thue bao ------------------------ */
  {
    key: pathRoutes.topUpSubscription,
    label: 'Nạp tiền cho thuê bao',
    icon: <FontAwesomeIcon icon={faReorder} />,
  },
  // Bán gói đơn lẻ cho thuê bao & Bán gói theo lô cho thuê bao
  {
    key: pathRoutes.sellBatchPackage,
    label: 'Bán gói theo lô cho thuê bao',
    icon: <FontAwesomeIcon icon={faReorder} />,
  },
  {
    key: pathRoutes.sellSinglePackage,
    label: 'Bán gói đơn lẻ cho thuê bao',
    icon: <FontAwesomeIcon icon={faReorder} />,
  },
  {
    key: pathRoutes.topupAssignPackage,
    icon: <FontAwesomeIcon icon={faMoneyBill1} />,
    label: 'Nạp tiền và gán gói',
  },
  // Tra cứu số
  {
    key: pathRoutes.lookupNumber,
    label: 'Tra cứu số',
    icon: <FontAwesomeIcon icon={faSearchPlus} />,
  },
  // Nghiệp vụ bán hàng
  {
    key: pathRoutes.after_sale,
    label: 'Nghiệp vụ bán hàng',
    hasChild: true,
  },
  {
    key: pathRoutes.activateSubscription,
    label: 'Kích hoạt thuê bao',
    parentId: pathRoutes.after_sale,
  },
  {
    key: pathRoutes.subscriberTopUpReport,
    icon: <FontAwesomeIcon icon={faLayerGroup} />,
    label: 'Báo cáo nạp tiền cho thuê bao',
  },
  {
    key: pathRoutes.packageSalesReport,
    icon: <FontAwesomeIcon icon={faLayerGroup} />,
    label: 'Báo cáo bán gói cho thuê bao',
  },
  {
    key: pathRoutes.reportPackageResult,
    icon: <FontAwesomeIcon icon={faReorder} />,
    label: 'Báo cáo kết quả bán gói theo lô',
  },
  {
    key: pathRoutes.luckyNumber,
    icon: <FontAwesomeIcon icon={faStar} />,
    label: 'Số may mắn',
  },
  // Đổi SIM hàng loạt
  {
    key: pathRoutes.simReplacement,
    label: 'Đổi SIM hàng loạt',
    icon: <FontAwesomeIcon icon={faReorder} />,
  },
];
