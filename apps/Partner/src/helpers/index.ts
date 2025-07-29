import { ActionType } from '@react/constants/app';

export const cleanUpString = (input: string) => {
  // Trim khoảng trắng đầu và cuối chuỗi
  const trimmedString = input.trim();

  // Thay thế nhiều khoảng trắng liên tiếp thành 1 khoảng trắng
  const cleanedString = trimmedString.replace(/\s\s+/g, ' ');

  return cleanedString;
};

export const cleanUpPhoneNumber = (input: string) => {
  // Trim khoảng trắng đầu và cuối chuỗi
  const trimmedString = input.trim();

  const cleanedString = trimmedString.replace(/\s*/g, '');

  return cleanedString;
};

export const subPageTitle = (actionType: string) => {
  switch (actionType) {
    case ActionType.ADD:
      return 'Thêm mới';
    case ActionType.VIEW:
      return 'Xem chi tiết';
    case ActionType.EDIT:
      return 'Sửa';
    case ActionType.COPY:
      return 'Sao chép';
    default:
      return '';
  }
};
