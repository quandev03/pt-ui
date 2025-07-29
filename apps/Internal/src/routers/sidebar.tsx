import {
  faChartLine,
  faHome,
  faListCheck,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MenuItem } from '@react/commons/types';
import { pathRoutes } from '../constants/routes';

export const menuItems: MenuItem[] = [
  {
    key: pathRoutes.dashboard,
    icon: <FontAwesomeIcon icon={faHome} />,
    label: 'Tổng quan',
  },
  {
    key: pathRoutes.account_authorization,
    icon: <FontAwesomeIcon icon={faUser} />,
    label: 'Quản Trị Hệ Thống',
    hasChild: true,
  },
  {
    key: pathRoutes.role_manager,
    label: 'Vai trò & Phân quyền',
    parentId: pathRoutes.account_authorization,
  },
  {
    key: pathRoutes.role_partner_manager,
    label: 'Vai trò & Phân quyền đối tác',
    parentId: pathRoutes.account_authorization,
  },
  {
    key: pathRoutes.userManager,
    label: 'Tài khoản',
    parentId: pathRoutes.account_authorization,
  },
  {
    key: pathRoutes.group_user_manager,
    label: 'Nhóm tài khoản',
    parentId: pathRoutes.account_authorization,
  },
  {
    key: pathRoutes.object,
    label: 'Quản lý object',
    parentId: pathRoutes.account_authorization,
  },
  {
    key: pathRoutes.parameterConfig,
    label: 'Cấu hình tham số',
    parentId: pathRoutes.account_authorization,
  },
  {
    key: pathRoutes.accessLog,
    label: 'Log truy cập',
    parentId: pathRoutes.account_authorization,
  },

  {
    key: pathRoutes.auditLog,
    label: 'Log thay đổi',
    parentId: pathRoutes.account_authorization,
  },

  // ============================Kinh doanh==================================================
  {
    key: pathRoutes.business,
    icon: <FontAwesomeIcon icon={faChartLine} />,
    label: 'Kinh Doanh',
    hasChild: true,
  },
  // Phê duyệt
  {
    key: pathRoutes.browsing,
    label: 'Phê duyệt',
    parentId: pathRoutes.business,
    hasChild: true,
  },
  {
    key: pathRoutes.config_approval,
    label: 'Quản lý cấu hình phê duyệt',
    parentId: pathRoutes.browsing,
  },
  {
    key: pathRoutes.approval,
    label: 'Quản lý phê duyệt',
    parentId: pathRoutes.browsing,
  },

  // Danh mục
  {
    key: pathRoutes.category,
    label: 'Quản lý danh mục',
    parentId: pathRoutes.business,
    hasChild: true,
  },
  {
    key: pathRoutes.listOfDepartment,
    label: 'Danh mục kho',
    parentId: pathRoutes.category,
  },
  {
    key: pathRoutes.category_reason,
    label: 'Danh mục lý do',
    parentId: pathRoutes.category,
  },
  {
    key: pathRoutes.areaCatalog,
    label: 'Danh mục địa bàn',
    parentId: pathRoutes.category,
  },
  {
    key: pathRoutes.category_profile,
    label: 'Danh mục profile',
    parentId: pathRoutes.category,
  },
  {
    key: pathRoutes.supplier,
    label: 'Danh mục nhà cung cấp',
    parentId: pathRoutes.category,
  },
  {
    key: pathRoutes.partnerCatalog,
    label: 'Danh mục đối tác',
    parentId: pathRoutes.category,
  },
  {
    key: pathRoutes.category_product,
    label: 'Danh mục loại sản phẩm',
    parentId: pathRoutes.category,
  },
  {
    key: pathRoutes.productCatalog,
    label: 'Danh mục sản phẩm',
    parentId: pathRoutes.category,
  },
  {
    key: pathRoutes.list_of_service_package,
    label: 'Danh mục gói cước',
    parentId: pathRoutes.category,
  },
  {
    key: pathRoutes.discount,
    label: 'Danh mục chiết khấu',
    parentId: pathRoutes.category,
  },
  {
    key: pathRoutes.coverageAreaManager,
    label: 'Danh mục phạm vi phủ sóng',
    parentId: pathRoutes.category,
  },
  {
    key: pathRoutes.deliveryFeecategory,
    label: 'Danh mục phí vận chuyển',
    parentId: pathRoutes.category,
  },
  {
    key: pathRoutes.deliveryPromotionscategory,
    parentId: pathRoutes.category, // để nguyên pathRoutes.category giùm
    label: 'Danh mục CTKM vận chuyển',
  },
  // Quản lý số
  {
    key: pathRoutes.phoneNoManagement,
    label: 'Quản lý số',
    parentId: pathRoutes.business,
    hasChild: true,
  },
  {
    key: pathRoutes.uploadNumber,
    parentId: pathRoutes.phoneNoManagement,
    label: 'Upload số',
  },
  {
    key: pathRoutes.numberPrefix,
    label: 'Đầu số',
    parentId: pathRoutes.phoneNoManagement,
  },
  {
    key: pathRoutes.classifySpecialNumber,
    label: 'Gán số đặc biệt',
    parentId: pathRoutes.phoneNoManagement,
  },
  {
    key: pathRoutes.transferNumber,
    label: 'Điều chuyển số ',
    parentId: pathRoutes.phoneNoManagement,
  },
  {
    key: pathRoutes.distributeNumber,
    label: 'Phân phối số ',
    parentId: pathRoutes.phoneNoManagement,
  },
  {
    key: pathRoutes.revokeNumber,
    label: 'Thu hồi số',
    parentId: pathRoutes.phoneNoManagement,
  },
  {
    key: pathRoutes.lookupNumber,
    label: 'Tra cứu kho số',
    parentId: pathRoutes.phoneNoManagement,
  },
  {
    key: pathRoutes.phoneNoCatalog,
    label: 'Danh mục kho số',
    parentId: pathRoutes.phoneNoManagement,
  },
  {
    key: pathRoutes.exportNumberPartner,
    label: 'Xuất số cho đối tác',
    parentId: pathRoutes.phoneNoManagement,
  },

  // Quản lý xuất nhập kho
  {
    key: pathRoutes.inventoryEximManagement,
    label: 'Quản lý xuất nhập kho',
    parentId: pathRoutes.business,
    hasChild: true,
  },
  {
    key: pathRoutes.importTransaction,
    label: 'Nhập khác',
    parentId: pathRoutes.inventoryEximManagement,
  },
  {
    key: pathRoutes.exportTransaction,
    label: 'Xuất khác',
    parentId: pathRoutes.inventoryEximManagement,
  },
  {
    key: pathRoutes.transactionSearchImportExport,
    label: 'Tra cứu GD xuất nhập',
    parentId: pathRoutes.inventoryEximManagement,
  },
  {
    key: pathRoutes.inventoryDetail,
    label: 'Xem thông tin kho',
    parentId: pathRoutes.inventoryEximManagement,
  },
  {
    key: pathRoutes.beginningInventory,
    label: 'Nhập tồn đầu kỳ',
    parentId: pathRoutes.inventoryEximManagement,
  },
  {
    key: pathRoutes.cycleLock,
    label: 'Khóa kỳ',
    parentId: pathRoutes.inventoryEximManagement,
  },
  // ------------------Quản lý SIM
  {
    key: pathRoutes.simManagement,
    label: 'Quản lý SIM',
    parentId: pathRoutes.business,
    hasChild: true,
  },
  {
    key: pathRoutes.serialLookup,
    label: 'Tra cứu Serial',
    parentId: pathRoutes.simManagement,
  },
  {
    key: pathRoutes.simUpload,
    label: 'Upload tài nguyên SIM',
    parentId: pathRoutes.simManagement,
  },
  {
    key: pathRoutes.uploadSimForm,
    label: 'Đơn upload',
    parentId: pathRoutes.simManagement,
  },

  // Quản lý KIT
  {
    key: pathRoutes.kitManagement,
    label: 'Quản lý KIT',
    parentId: pathRoutes.business,
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

  // Xuất nhập từ NCC
  {
    key: pathRoutes.merchant,
    label: 'Xuất nhập từ NCC',
    parentId: pathRoutes.business,
    hasChild: true,
  },
  {
    key: pathRoutes.merchantOrderList,
    label: 'Quản lý đơn mua hàng NCC',
    parentId: pathRoutes.merchant,
  },
  {
    key: pathRoutes.merchantEximNote,
    label: 'Quản lý phiếu nhập kho từ NCC',
    parentId: pathRoutes.merchant,
  },
  {
    key: pathRoutes.merchantEximTransList,
    label: 'Quản lý giao dịch nhập từ NCC',
    parentId: pathRoutes.merchant,
  },

  // Xuất nhập với đối tác
  {
    key: pathRoutes.partnerManagement,
    label: 'Xuất nhập với đối tác',
    parentId: pathRoutes.business,
    hasChild: true,
  },
  {
    key: pathRoutes.partnerCreditLimits,
    label: 'Quản lý hạn mức',
    parentId: pathRoutes.partnerManagement,
  },
  {
    key: pathRoutes.orderList,
    label: 'Quản lý đơn hàng',
    parentId: pathRoutes.partnerManagement,
  },
  {
    key: pathRoutes.stockOutForDistributor,
    label: 'Quản lý phiếu XN cho đối tác',
    parentId: pathRoutes.partnerManagement,
  },
  {
    key: pathRoutes.eximDistributorTransactionList,
    label: 'Quản lý GD XN với đối tác',
    parentId: pathRoutes.partnerManagement,
  },
  {
    key: pathRoutes.managePartnerAirtimeAccount,
    label: 'Quản lý tài khoản airtime',
    parentId: pathRoutes.partnerManagement,
  },
  {
    key: pathRoutes.airtimeBonusTransactionPartner,
    label: 'Quản lý giao dịch cộng tiền airtime',
    parentId: pathRoutes.partnerManagement,
  },
  // Xuất nhập nội bộ
  {
    key: pathRoutes.internalEximManagement,
    label: 'Xuất nhập nội bộ',
    parentId: pathRoutes.business,
    hasChild: true,
  },
  {
    key: pathRoutes.internalExportProposal,
    label: 'Đề nghị xuất kho gửi đi',
    parentId: pathRoutes.internalEximManagement,
  },
  {
    key: pathRoutes.internalWarehouseDeliveryNote,
    label: 'Lập phiếu XN kho nội bộ',
    parentId: pathRoutes.internalEximManagement,
  },
  {
    key: pathRoutes.internalImportExportWarehouse,
    label: 'DS GD xuất nhập nội bộ',
    parentId: pathRoutes.internalEximManagement,
  },
  {
    key: pathRoutes.internalExportProposalReceive,
    label: 'Đề nghị xuất kho nhận được',
    parentId: pathRoutes.internalEximManagement,
  },

  {
    key: pathRoutes.shippingConfigurations,
    label: 'Cấu hình vận chuyển',
    parentId: pathRoutes.business,
  },

  // ===============================Dịch vụ khách hàng=================================
  {
    key: pathRoutes.customer,
    icon: <FontAwesomeIcon icon={faListCheck} />,
    label: 'Dịch Vụ Khách Hàng',
    hasChild: true,
  },
  // Nghiệp vụ bán hàng
  {
    key: pathRoutes.sale,
    label: 'Nghiệp vụ bán hàng',
    parentId: pathRoutes.customer,
    hasChild: true,
  },
  {
    key: pathRoutes.activateSubscription,
    label: 'Kích hoạt thuê bao',
    parentId: pathRoutes.sale,
  },
  {
    key: pathRoutes.after_sale,
    label: 'Nghiệp vụ sau bán',
    parentId: pathRoutes.customer,
    hasChild: true,
  },
  {
    key: pathRoutes.subscriberOwnershipTransfer,
    label: 'Chuyển chủ quyền',
    parentId: pathRoutes.after_sale,
  },
  {
    key: pathRoutes.listOfRequestsChangeSim,
    label: 'Danh sách yêu cầu đổi SIM đơn lẻ',
    parentId: pathRoutes.after_sale,
  },
  {
    key: pathRoutes.simReplacement,
    label: 'Danh sách yêu cầu đổi SIM hàng loạt',
    parentId: pathRoutes.after_sale,
  },
  {
    key: pathRoutes.customerInfoChange,
    label: 'Thay đổi thông tin thuê bao',
    parentId: pathRoutes.after_sale,
  },
  // Quản lý hồ sơ
  {
    key: pathRoutes.documentManagement,
    label: 'Quản lý hồ sơ',
    parentId: pathRoutes.customer,
    hasChild: true,
  },
  {
    key: pathRoutes.activationRequestList,
    label: 'Danh sách yêu cầu kích hoạt',
    parentId: pathRoutes.documentManagement,
  },
  {
    key: pathRoutes.activationAssignedList,
    label: 'Danh sách phân công tiền kiểm',
    parentId: pathRoutes.documentManagement,
  },
  {
    key: pathRoutes.activationApproveList,
    label: 'Danh sách tiền kiểm',
    parentId: pathRoutes.documentManagement,
  },
  {
    key: pathRoutes.verificationList,
    label: 'Danh sách phân công kiểm duyệt',
    parentId: pathRoutes.documentManagement,
  },
  {
    key: pathRoutes.verificationListStaff,
    label: 'Danh sách kiểm duyệt',
    parentId: pathRoutes.documentManagement,
  },
  {
    key: pathRoutes.post_check_list,
    label: 'Danh sách hậu kiểm',
    parentId: pathRoutes.documentManagement,
  },
  // Tra cứu thông tin
  {
    key: pathRoutes.searchInfo,
    label: 'Tra cứu thông tin',
    parentId: pathRoutes.customer,
    hasChild: true,
  },
  {
    key: pathRoutes.searchSubscription,
    label: 'Tra cứu thuê bao (Admin)',
    parentId: pathRoutes.searchInfo,
  },
  {
    key: pathRoutes.searchSubscriptionStaff,
    label: 'Tra cứu thuê bao (CSKH)',
    parentId: pathRoutes.searchInfo,
  },
  {
    key: pathRoutes.subscriberNoImpact,
    label: 'DS thuê bao cấm tác động',
    parentId: pathRoutes.searchInfo,
  },
  //quản lý khách hàng doanh nghiệp
  {
    key: pathRoutes.enterpriseCustomerManagement,
    label: 'Quản lý KHDN',
    parentId: pathRoutes.customer,
    hasChild: true,
  },
  {
    key: pathRoutes.businessManagement,
    label: 'Quản lý doanh nghiệp',
    parentId: pathRoutes.enterpriseCustomerManagement,
  },
  {
    key: pathRoutes.enterpriseCustomerManagementH2HActive,
    label: 'Kích hoạt thuê bao KHDN H2H',
    parentId: pathRoutes.enterpriseCustomerManagement,
  },
  {
    key: pathRoutes.enterpriseCustomerManagementM2MActive,
    label: 'Kích hoạt thuê bao KHDN M2M',
    parentId: pathRoutes.enterpriseCustomerManagement,
  },
  {
    key: pathRoutes.subscriberImpactReport,
    label: 'Báo cáo tác động thuê bao theo file KHDN',
    parentId: pathRoutes.enterpriseCustomerManagement,
  },
  {
    key: pathRoutes.catalogSaleandAM,
    label: 'Danh mục NVKD/AM',
    parentId: pathRoutes.enterpriseCustomerManagement,
  },
  {
    key: pathRoutes.configManagementCustomer,
    label: 'Quản lý cấu hình',
    parentId: pathRoutes.customer,
    hasChild: true,
  },
  {
    key: pathRoutes.promotionHistory,
    label: 'Lịch sử chạy CTKM',
    parentId: pathRoutes.configManagementCustomer,
  },
  {
    key: pathRoutes.customerReasonList,
    label: 'Danh mục lý do',
    parentId: pathRoutes.configManagementCustomer,
  },
  {
    key: pathRoutes.configSystemParamList,
    label: 'Cấu hình tham số hệ thống',
    parentId: pathRoutes.configManagementCustomer,
  },
  {
    key: pathRoutes.configurationManagement,
    label: 'Quản lý cấu hình kích hoạt',
    parentId: pathRoutes.configManagementCustomer,
  },
  {
    key: pathRoutes.promotionRestManagement,
    parentId: pathRoutes.configManagementCustomer,
    label: 'Danh mục chương trình khuyến mại',
  },

  //  Quản lý yêu cầu phản ánh
  {
    key: pathRoutes.feedback,
    label: 'Quản lý yêu cầu phản ánh',
    parentId: pathRoutes.customer,
    hasChild: true,
  },
  {
    key: pathRoutes.feedbackCSKH,
    label: 'Yêu cầu phản ánh (CSKH)',
    parentId: pathRoutes.feedback,
  },
  {
    key: pathRoutes.feedbackBO,
    label: 'Yêu cầu phản ánh (BO)',
    parentId: pathRoutes.feedback,
  },
  {
    key: pathRoutes.feedbackAssigned,
    label: 'Yêu cầu phản ánh (Được phân công)',
    parentId: pathRoutes.feedback,
  },
  {
    // không xóa khi conflict giùm
    key: pathRoutes.reflectionCategory,
    label: 'Danh mục loại phản ánh',
    parentId: pathRoutes.feedback,
  },
  {
    key: pathRoutes.kitUncraft,
    label: 'Hủy ghép KIT',
    parentId: pathRoutes.kitManagement,
  },

  // ===============================Báo cáocáo=================================
  {
    key: pathRoutes.reportsKd,
    label: 'Báo cáo',
    parentId: pathRoutes.business,
    hasChild: true,
  },
  {
    key: pathRoutes.reportInventory,
    label: 'Báo cáo xuất nhập tồn',
    parentId: pathRoutes.reportsKd,
  },
  {
    key: pathRoutes.inventorExportReport,
    label: 'Báo cáo xuất kho',
    parentId: pathRoutes.reportsKd,
  },
  {
    key: pathRoutes.inventorImportReport,
    label: 'Báo cáo nhập kho',
    parentId: pathRoutes.reportsKd,
  },
  {
    key: pathRoutes.orderOnlineDetailReport,
    label: 'Báo cáo chi tiết đơn hàng online',
    parentId: pathRoutes.reportsKd,
  },
  {
    key: pathRoutes.packageSalesReport,
    label: 'Báo cáo Đối tác bán gói',
    parentId: pathRoutes.reportsKd,
  },
  {
    key: pathRoutes.reportOnPackagePurchase,
    label: 'Báo cáo gói cước',
    parentId: pathRoutes.reportsKd,
  },
  {
    key: pathRoutes.partnerOrderReport,
    label: 'Báo cáo chi tiết đơn hàng đối tác',
    parentId: pathRoutes.reportsKd,
  },
  {
    key: pathRoutes.promotionSummaryReport,
    label: 'Báo cáo tổng hợp mã khuyến mại',
    parentId: pathRoutes.reportsKd,
  },
  {
    key: pathRoutes.promotionDetailReport,
    label: 'Báo cáo chi tiết mã khuyến mại',
    parentId: pathRoutes.reportsKd,
  },
  {
    key: pathRoutes.shippingReport,
    label: 'Báo cáo vận chuyển',
    parentId: pathRoutes.reportsKd,
  },
  {
    key: pathRoutes.subscriberTopUpReport,
    label: 'Báo cáo Đối tác nạp tiền cho thuê bao',
    parentId: pathRoutes.reportsKd,
  },
  {
    key: pathRoutes.rechargeReport,
    label: 'Báo cáo nạp tiền',
    parentId: pathRoutes.reportsKd,
  },
  // ----------------Báo cáo DVKH----------------
  {
    key: pathRoutes.reports,
    label: 'Báo cáo',
    hasChild: true,
    parentId: pathRoutes.customer,
  },
  {
    key: pathRoutes.reportActivate,
    label: 'Báo cáo kích hoạt',
    parentId: pathRoutes.reports,
  },
  {
    key: pathRoutes.reportCriteria,
    label: 'Báo cáo 8 tiêu chí',
    parentId: pathRoutes.reports,
  },
  {
    key: pathRoutes.reportChangeSim,
    label: 'Báo cáo đổi SIM',
    parentId: pathRoutes.reports,
  },
  {
    key: pathRoutes.reportPreCheck,
    label: 'Báo cáo tiền kiểm',
    parentId: pathRoutes.reports,
  },
  {
    key: pathRoutes.reportCensorship,
    label: 'Báo cáo kiểm duyệt',
    parentId: pathRoutes.reports,
  },
  {
    key: pathRoutes.reportPostCheck,
    label: 'Báo cáo hậu kiểm',
    parentId: pathRoutes.reports,
  },
  {
    key: pathRoutes.reportAgency,
    label: 'Báo cáo cơ quan quản lý nhà nước',
    parentId: pathRoutes.reports,
  },
  {
    key: pathRoutes.reportFeedback,
    label: 'Báo cáo phản ánh',
    parentId: pathRoutes.reports,
  },
  // ----------------Chương trình khuyến mại kinh doanh----------------
  {
    key: pathRoutes.managementPromotionProgramBusiness,
    label: 'Quản lý mã khuyến mại',
    parentId: pathRoutes.business,
    hasChild: true,
  },
  {
    key: pathRoutes.promotionProgramBusiness,
    label: 'Danh sách mã khuyến mại',
    parentId: pathRoutes.managementPromotionProgramBusiness,
  },

  // Quản lý kênh bán lẻ
  {
    key: pathRoutes.channelManagement,
    label: 'Quản lý kênh bán lẻ',
    parentId: pathRoutes.business,
    hasChild: true,
  },
  {
    key: pathRoutes.onlineOrders,
    label: 'Quản lý đơn hàng online',
    parentId: pathRoutes.channelManagement,
  },
  {
    key: pathRoutes.onlineOrderCS,
    label: 'Quản lý đơn hàng online CS',
    parentId: pathRoutes.channelManagement,
  },
  {
    key: pathRoutes.onlineOrderAtStore,
    label: 'Quản lý đơn hàng nhận tại cửa hàng',
    parentId: pathRoutes.channelManagement,
  },

  // Not Use
  // {
  //   key: pathRoutes.eximDistributor,
  //   label: 'Xuất nhập với NPP',
  //   parentId: pathRoutes.business,
  //   hasChild: true,
  // },
  // {
  //   key: pathRoutes.stockIn,
  //   label: 'Nhập kho cho Đối tác',
  //   parentId: pathRoutes.warehouseManagement,
  // },
];
