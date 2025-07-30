// Layout Constants
export const UI_CONSTANTS = {
  // Heights
  HEADER_HEIGHT: 71,
  FOOTER_HEIGHT: 60,
  SIDEBAR_WIDTH: 280,
  SIDEBAR_COLLAPSED_WIDTH: 80,

  // Table
  TABLE_MARGIN: 50,
  TABLE_HEADER_HEIGHT: 56,
  TABLE_ROW_HEIGHT: 48,
  PAGINATION_HEIGHT: 64,
  FILTER_HEIGHT: 56,

  // Form
  FORM_ITEM_MARGIN: 10,
  INPUT_HEIGHT: 36,
  BUTTON_HEIGHT: 36,

  // Modal
  MODAL_PADDING: 24,
  MODAL_HEADER_HEIGHT: 56,

  // Breakpoints (matching Tailwind)
  BREAKPOINTS: {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    '2XL': 1536,
  },

  // Z-Index
  Z_INDEX: {
    DROPDOWN: 1000,
    MODAL: 1050,
    NOTIFICATION: 1100,
    TOOLTIP: 1150,
    LOADING: 1200,
  },

  // Animation
  ANIMATION: {
    DURATION: {
      FAST: 150,
      NORMAL: 300,
      SLOW: 500,
    },
    EASING: {
      EASE_IN: 'cubic-bezier(0.4, 0, 1, 1)',
      EASE_OUT: 'cubic-bezier(0, 0, 0.2, 1)',
      EASE_IN_OUT: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },

  // Spacing
  SPACING: {
    XS: 4,
    SM: 8,
    MD: 16,
    LG: 24,
    XL: 32,
    XXL: 48,
  },
} as const;

// Color Constants - Centralized color management
// Use these constants instead of hardcoding colors throughout the application
export const COLORS = {
  // Primary brand colors
  PRIMARY: 'rgba(255, 204, 99, 1)',
  PRIMARY_HOVER: '#ffd88a',
  SECONDARY: '#231F20',

  // Status Colors
  SUCCESS: '#128300',
  WARNING: '#FF9900',
  ERROR: '#E51616',
  INFO: '#1365E1',

  // Text Colors
  TEXT_PRIMARY: '#151515',
  TEXT_SECONDARY: '#666666',
  TEXT_DISABLED: '#C3C3C3',
  TEXT_PLACEHOLDER: '#616774',

  // Background Colors
  BG_PRIMARY: '#FFFFFF',
  BG_SECONDARY: '#F8F8F8',
  BG_DISABLED: '#F5F5F5',

  // Border Colors - Main border color used throughout the app
  BORDER_LIGHT: '#F3F3F4',
  BORDER_DEFAULT: '#D9D9D9', // Use this instead of hardcoding #d9d9d9
  BORDER_DARK: '#3E3E40',

  // Gray scale for consistency
  GRAY_50: '#F9FAFB',
  GRAY_100: '#F3F4F6',
  GRAY_200: '#E5E7EB',
  GRAY_300: '#D1D5DB', // Matches #D9D9D9 approximately
  GRAY_400: '#9CA3AF',
  GRAY_500: '#6B7280',
  GRAY_600: '#4B5563',
  GRAY_700: '#374151',
  GRAY_800: '#1F2937',
  GRAY_900: '#111827',
} as const;

// Ant Design Design Tokens - Mapping our colors to Ant Design token system
export const ANT_DESIGN_TOKENS = {
  colorPrimary: COLORS.PRIMARY,
  // colorSuccess: COLORS.SUCCESS,
  colorWarning: COLORS.WARNING,
  colorError: COLORS.ERROR,
  colorInfo: COLORS.INFO,
  colorText: COLORS.TEXT_PRIMARY,
  colorTextSecondary: COLORS.TEXT_SECONDARY,
  colorTextDisabled: COLORS.TEXT_DISABLED,
  colorBgBase: COLORS.BG_PRIMARY,
  colorBgSecondary: COLORS.BG_SECONDARY,
  colorBorder: COLORS.BORDER_DEFAULT,
  colorBorderSecondary: COLORS.BORDER_LIGHT,
} as const;

// Tailwind Class Mapping - Use these instead of arbitrary values
export const TAILWIND_CLASSES = {
  // Text colors
  TEXT_PRIMARY: 'text-gray-900',
  TEXT_SECONDARY: 'text-gray-600',
  TEXT_DISABLED: 'text-gray-400',
  TEXT_SUCCESS: 'text-green-600',
  TEXT_WARNING: 'text-orange-500',
  TEXT_ERROR: 'text-red-600',
  TEXT_INFO: 'text-blue-600',

  // Background colors
  BG_PRIMARY: 'bg-white',
  BG_SECONDARY: 'bg-gray-50',
  BG_DISABLED: 'bg-gray-100',
  BG_SUCCESS: 'bg-green-50',
  BG_WARNING: 'bg-orange-50',
  BG_ERROR: 'bg-red-50',
  BG_INFO: 'bg-blue-50',

  // Border colors
  BORDER_DEFAULT: 'border-gray-300', // Equivalent to #D9D9D9
  BORDER_LIGHT: 'border-gray-100',
  BORDER_DARK: 'border-gray-700',
  BORDER_SUCCESS: 'border-green-300',
  BORDER_WARNING: 'border-orange-300',
  BORDER_ERROR: 'border-red-300',
  BORDER_INFO: 'border-blue-300',
} as const;

// Component Constants
export const COMPONENT_CONSTANTS = {
  // Pagination
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 20,
    PAGE_SIZE_OPTIONS: [20, 50, 100],
    SHOW_SIZE_CHANGER: true,
    SHOW_QUICK_JUMPER: false,
  },

  // Table
  TABLE: {
    SCROLL_BAR_WIDTH: 8,
    SELECTION_COLUMN_WIDTH: 60,
    ACTION_COLUMN_WIDTH: 120,
    MIN_COLUMN_WIDTH: 100,
  },

  // Form
  FORM: {
    LABEL_POSITION: 'top' as const,
    VALIDATE_TRIGGER: ['onChange', 'onBlur'] as const,
    PRESERVE_FIELD_VALUES: true,
  },

  // Upload
  UPLOAD: {
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    ACCEPTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif'],
    ACCEPTED_DOCUMENT_TYPES: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ],
  },
} as const;

// Message Constants
export const MESSAGES = {
  // Success
  SUCCESS: {
    CREATE: 'Tạo mới thành công',
    UPDATE: 'Cập nhật thành công',
    DELETE: 'Xóa thành công',
    SAVE: 'Lưu thành công',
    UPLOAD: 'Tải lên thành công',
    EXPORT: 'Xuất dữ liệu thành công',
    IMPORT: 'Nhập dữ liệu thành công',
  },

  // Error
  ERROR: {
    GENERAL: 'Có lỗi xảy ra, vui lòng thử lại',
    NETWORK: 'Lỗi kết nối mạng',
    UNAUTHORIZED: 'Bạn không có quyền thực hiện thao tác này',
    FORBIDDEN: 'Truy cập bị từ chối',
    NOT_FOUND: 'Không tìm thấy dữ liệu',
    SERVER_ERROR: 'Lỗi server, vui lòng liên hệ quản trị viên',
    VALIDATION: 'Dữ liệu không hợp lệ',
    UPLOAD_FAILED: 'Tải lên thất bại',
  },

  // Confirmation
  CONFIRM: {
    DELETE: 'Bạn có chắc chắn muốn xóa không?',
    DELETE_MULTIPLE: 'Bạn có chắc chắn muốn xóa {count} mục đã chọn?',
    SAVE: 'Bạn có muốn lưu thay đổi không?',
    CANCEL: 'Bạn có muốn hủy thao tác không?',
    LOGOUT: 'Bạn có muốn đăng xuất không?',
  },

  // Info
  INFO: {
    NO_DATA: 'Không có dữ liệu',
    LOADING: 'Đang tải...',
    UPLOADING: 'Đang tải lên...',
    PROCESSING: 'Đang xử lý...',
    EMPTY_SELECTION: 'Vui lòng chọn ít nhất một mục',
  },
} as const;

// Validation Constants
export const VALIDATION = {
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 50,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBER: true,
    REQUIRE_SPECIAL_CHAR: true,
  },

  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },

  PHONE: {
    PATTERN: /^[0-9]{10,11}$/,
  },

  TEXT: {
    MAX_LENGTH: 255,
    MIN_LENGTH: 1,
  },

  NUMBER: {
    MIN: 0,
    MAX: Number.MAX_SAFE_INTEGER,
  },
} as const;
