import { ColorList } from "@react/constants/color";
import { ReasonCodeEnum } from "../../hooks/useReasonCatalogService";

export const moveMethod = [
  { value: 1, label: 'Xuất kho' },
  { value: 2, label: 'Nhập kho' },
  // { value: 3, label: 'Thu hồi' },
  // { value: 4, label: 'Trả hàng' },
  // { value: '', label: 'Tất cả' },
];

export const statusTransaction = [
  {value: 1, label: 'Đã xuất'},
  {value: 2, label: 'Đã hủy'},
]

export const getStatusTransactionColor = (value: number) => {
  switch (value) {
    case 1:
      return ColorList.SUCCESS;
    case 2:
      return ColorList.CANCEL
    default:
      return 'default';
  }
};

export const reasonExportInventory = ReasonCodeEnum.NPP_IMPORT_EXPORT;
