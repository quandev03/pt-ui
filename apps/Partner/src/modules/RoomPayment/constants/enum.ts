import { PaymentStatus } from '../types';

export const PaymentStatusMap: Record<PaymentStatus, string> = {
  [PaymentStatus.UNPAID]: 'Chưa thanh toán',
  [PaymentStatus.PAID]: 'Đã thanh toán',
};

export const PaymentStatusOptions = [
  {
    label: 'Chưa thanh toán',
    value: PaymentStatus.UNPAID,
  },
  {
    label: 'Đã thanh toán',
    value: PaymentStatus.PAID,
  },
];

export const MonthOptions = Array.from({ length: 12 }, (_, i) => ({
  label: `Tháng ${i + 1}`,
  value: i + 1,
}));

