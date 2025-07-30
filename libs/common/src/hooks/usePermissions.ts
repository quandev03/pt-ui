import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { IModeAction, MenuObjectItem } from '../types';
import {
  checkPermission,
  getPermissionsForUri,
  hasCreatePermission,
  hasDeletePermission,
  hasReadPermission,
  hasUpdatePermission,
} from '../utils';

/**
 * Hook để kiểm tra quyền dựa trên URI hiện tại hoặc URI được chỉ định
 */
export const usePermissions = (menuData: MenuObjectItem[], uri?: string) => {
  const location = useLocation();

  // Sử dụng URI được truyền vào hoặc pathname hiện tại
  const currentUri = uri || location.pathname;

  // Memoize các function kiểm tra quyền để tránh re-render không cần thiết
  const permissions = useMemo(() => {
    return {
      /**
       * Kiểm tra quyền CREATE
       */
      canCreate: hasCreatePermission(menuData, currentUri),

      /**
       * Kiểm tra quyền READ
       */
      canRead: hasReadPermission(menuData, currentUri),

      /**
       * Kiểm tra quyền UPDATE
       */
      canUpdate: hasUpdatePermission(menuData, currentUri),

      /**
       * Kiểm tra quyền DELETE
       */
      canDelete: hasDeletePermission(menuData, currentUri),

      /**
       * Kiểm tra quyền custom
       */
      hasPermission: (action: IModeAction) =>
        checkPermission(menuData, currentUri, action),

      /**
       * Lấy tất cả quyền
       */
      getAllPermissions: () => getPermissionsForUri(menuData, currentUri),

      /**
       * URI hiện tại được kiểm tra
       */
      currentUri,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUri, menuData]);

  return permissions;
};

/**
 * Hook để kiểm tra quyền cho một URI cụ thể
 */
export const usePermissionsForUri = (
  menuData: MenuObjectItem[],
  uri: string
) => {
  const permissions = useMemo(() => {
    return {
      canCreate: hasCreatePermission(menuData, uri),
      canRead: hasReadPermission(menuData, uri),
      canUpdate: hasUpdatePermission(menuData, uri),
      canDelete: hasDeletePermission(menuData, uri),
      hasPermission: (action: IModeAction) =>
        checkPermission(menuData, uri, action),
      getAllPermissions: () => getPermissionsForUri(menuData, uri),
      uri,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uri, menuData]);

  return permissions;
};

/**
 * Hook để kiểm tra nhiều quyền cùng lúc
 */
export const useMultiplePermissions = (
  checks: Array<{ uri: string; action: IModeAction }>,
  menuData: MenuObjectItem[]
) => {
  const results = useMemo(() => {
    return checks.map(({ uri, action }) => ({
      uri,
      action,
      hasPermission: checkPermission(menuData, uri, action),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checks, menuData]);

  return results;
};
