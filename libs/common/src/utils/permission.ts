import { IModeAction, MenuObjectItem } from '../types';

/**
 * Kiểm tra quyền action trên một URI cụ thể
 * @param uri - URI cần kiểm tra quyền
 * @param action - Action cần kiểm tra (CREATE, READ, UPDATE, DELETE...)
 * @returns boolean - true nếu có quyền, false nếu không có quyền
 */
export const checkPermission = (
  menuData: MenuObjectItem[],
  uri: string,
  action: IModeAction
): boolean => {
  if (!menuData || menuData.length === 0) {
    return false;
  }

  // Tìm menu item tương ứng với URI
  const findMenuByUri = (
    menus: MenuObjectItem[],
    targetUri: string
  ): MenuObjectItem | null => {
    for (const menu of menus) {
      // Kiểm tra URI chính xác hoặc URI cha (để hỗ trợ nested routes)
      if (menu.uri === targetUri || targetUri.startsWith(menu.uri + '/')) {
        return menu;
      }

      // Tìm trong items con
      if (menu.items && menu.items.length > 0) {
        const found = findMenuByUri(menu.items, targetUri);
        if (found) return found;
      }
    }
    return null;
  };

  const MenuObjectItem = findMenuByUri(menuData, uri);

  if (!MenuObjectItem) {
    return false;
  }

  // Kiểm tra action có trong danh sách actions không
  return MenuObjectItem.actions.includes(action);
};

/**
 * Kiểm tra quyền CREATE cho một URI
 * @param uri - URI cần kiểm tra quyền CREATE
 * @returns boolean - true nếu có quyền CREATE
 */
export const hasCreatePermission = (
  menuData: MenuObjectItem[],
  uri: string
): boolean => {
  return checkPermission(menuData, uri, IModeAction.CREATE);
};

/**
 * Kiểm tra quyền READ cho một URI
 * @param uri - URI cần kiểm tra quyền READ
 * @returns boolean - true nếu có quyền READ
 */
export const hasReadPermission = (
  menuData: MenuObjectItem[],
  uri: string
): boolean => {
  return checkPermission(menuData, uri, IModeAction.READ);
};

/**
 * Kiểm tra quyền UPDATE cho một URI
 * @param uri - URI cần kiểm tra quyền UPDATE
 * @returns boolean - true nếu có quyền UPDATE
 */
export const hasUpdatePermission = (
  menuData: MenuObjectItem[],
  uri: string
): boolean => {
  return checkPermission(menuData, uri, IModeAction.UPDATE);
};

/**
 * Kiểm tra quyền DELETE cho một URI
 * @param uri - URI cần kiểm tra quyền DELETE
 * @returns boolean - true nếu có quyền DELETE
 */
export const hasDeletePermission = (
  menuData: MenuObjectItem[],
  uri: string
): boolean => {
  return checkPermission(menuData, uri, IModeAction.DELETE);
};

/**
 * Lấy tất cả actions có quyền cho một URI
 * @param uri - URI cần kiểm tra
 * @returns ActionsTypeEnum[] - Danh sách actions có quyền
 */
export const getPermissionsForUri = (
  menuData: MenuObjectItem[],
  uri: string
): IModeAction[] => {
  if (!menuData || menuData.length === 0) {
    return [];
  }

  const findMenuByUri = (
    menus: MenuObjectItem[],
    targetUri: string
  ): MenuObjectItem | null => {
    for (const menu of menus) {
      if (menu.uri === targetUri || targetUri.startsWith(menu.uri + '/')) {
        return menu;
      }

      if (menu.items && menu.items.length > 0) {
        const found = findMenuByUri(menu.items, targetUri);
        if (found) return found;
      }
    }
    return null;
  };

  const MenuObjectItem = findMenuByUri(menuData, uri);
  return MenuObjectItem ? MenuObjectItem.actions : [];
};
