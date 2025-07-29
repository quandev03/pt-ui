import { Breadcrumb } from 'antd';
import React, { memo, useCallback, useMemo } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { menuItems } from 'apps/Internal/src/routers/sidebar';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import {
  BreadcrumbItemType,
  BreadcrumbSeparatorType,
} from 'antd/es/breadcrumb/Breadcrumb';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useConfigAppNoPersistStore from 'apps/Internal/src/components/layouts/store/useConfigAppNoPersistStore';

const specialPaths = [
  {
    key: 'view',
    label: 'Xem chi tiết',
  },
  {
    key: 'view-',
    label: 'Xem chi tiết',
  },
  {
    key: 'add',
    label: 'Tạo mới',
  },
  {
    key: 'add-',
    label: 'Tạo mới',
  },
  {
    key: 'add-sale',
    label: 'Tạo mới NVKD',
  },
  {
    key: 'add-am',
    label: 'Tạo mới NVAM',
  },
  {
    key: 'add-import',
    label: 'Tạo mới',
  },
  {
    key: 'edit',
    label: 'Chỉnh sửa',
  },
  {
    key: 'edit-',
    label: 'Chỉnh sửa',
  },
  {
    key: 'copy-import',
    label: 'Sao chép',
  },
  {
    key: pathRoutes.profile,
    label: 'Thông tin tài khoản',
  },
  {
    key: 'copy-import',
    label: 'Sao chép',
  },
  {
    key: pathRoutes.profile,
    label: 'Thông tin tài khoản',
  },
  {
    key: 'user-management',
    label: 'Quản lý user đối tác',
  },
  {
    key: 'impact-history',
    label: 'Lịch sử tác động',
  },
  {
    key: 'package-capacity',
    label: 'Tra cứu thông tin gói cước',
  },
  {
    key: 'package-history',
    label: 'Lịch sử đăng ký gói cước',
  },
  {
    key: 'sms-history',
    label: 'Lịch sử SMS',
  },
  {
    key: 'by-file',
    label: 'Theo file',
  },
  {
    key: 'add-representative',
    label: 'Tạo mới',
  },
  {
    key: 'view-representative',
    label: 'Xem chi tiết',
  },
  {
    key: 'edit-representative',
    label: 'Chỉnh sửa',
  },
  {
    key: 'add-export',
    label: 'Tạo mới',
  },
  {
    key: 'view-export',
    label: 'Xem chi tiết',
  },
  {
    key: 'view-import',
    label: 'Xem chi tiết',
  },
  {
    key: 'exim-distributor-transaction',
    label: null,
  },
  {
    key: 'internal-import',
    label: null,
  },
  {
    key: 'internal-export',
    label: null,
  },
  {
    key: 'merchant-exim',
    label: null,
  },
  {
    key: 'export-other-way',
    label: null,
  },
  {
    key: 'import-other-way',
    label: null,
  },
  {
    key: 'profile',
    label: 'Thông tin tài khoản',
  },
  {
    key: 'export-kit',
    label: 'Xuất kít',
  },
  {
    key: 'import-kit',
    label: 'Nhập kít',
  },
  {
    key: 'import-sim',
    label: 'Nhập SIM',
  },
  {
    key: 'export-sim',
    label: 'Xuất SIM',
  },
];

const BreadcrumbComponent: React.FC = () => {
  const { breadcrumbsParams } = useConfigAppNoPersistStore();
  const { orgCode, id } = useParams<{ orgCode?: string; id?: string }>();
  const { pathname } = useLocation();

  const getLabelFromMenuItems = useCallback((key: string): string => {
    const menuItem = menuItems.find((item) => item.key === `/${key}`);
    return menuItem ? menuItem.label : key;
  }, []);

  const getItemFromMenuItems = useCallback((key: string) => {
    return menuItems.find((item) => item.key === `/${key}` || item.key === key);
  }, []);

  const getParentItemFromMenuItems = useCallback((key: string) => {
    const result: string[] = [];
    const menuItem = menuItems.find((item) => item.key === key);
    if (menuItem) {
      result.push(
        menuItem.key.startsWith('/') ? menuItem.key.slice(1) : menuItem.key
      );
      if (menuItem.parentId) {
        const subResult = getParentItemFromMenuItems(menuItem.parentId);
        result.push(...subResult);
      }
    }
    return result;
  }, []);

  const breadcrumbItems = useMemo(() => {
    let pathSnippets = pathname.split('/').filter((i) => i);
    const parentItem = getParentItemFromMenuItems(`/${pathSnippets[0]}`);
    if (parentItem.length > 0) parentItem.shift();
    parentItem.reverse();
    pathSnippets = parentItem.concat(pathSnippets);

    const resultNode: Partial<BreadcrumbItemType & BreadcrumbSeparatorType>[] =
      pathSnippets.map((_) => {
        const itemInMenus = getItemFromMenuItems(_);
        const item: Partial<BreadcrumbItemType & BreadcrumbSeparatorType> = {
          title: null,
        };
        if (itemInMenus) {
          item.title = !itemInMenus.hasChild ? (
            <Link to={itemInMenus.key}>{itemInMenus.label}</Link>
          ) : (
            itemInMenus.label
          );
        } else {
          item.title = getLabelFromMenuItems(_);
        }
        const nameSpecial = specialPaths.find((item) => _.includes(item.key));
        if (nameSpecial) item.title = nameSpecial.label;
        if (_ === orgCode) {
          item.title = '';
          // const url = pathname.split(orgCode);
          // item.title = (
          //   <Link to={url[0] + orgCode}>
          //     {breadcrumbsParams.orgCode ?? orgCode}
          //   </Link>
          // );
        } else if (_ === id) {
          item.title = '';
          // const url = pathname.split(id);
          // item.title = (
          //   <Link to={url[0] + id}>{breadcrumbsParams.id ?? id}</Link>
          // );
        }
        return item;
      });

    resultNode.unshift({
      href: `/#${pathRoutes.welcome}`,
      title: <FontAwesomeIcon icon={faHome} />,
    });
    if (
      pathname === `/${pathRoutes.welcome}` ||
      pathname === `/${pathRoutes.dashboard}` ||
      pathname === `/`
    ) {
      resultNode.push({
        title: 'Trang chủ',
      });
    }

    return resultNode.filter((item) => item.title);
  }, [pathname, getLabelFromMenuItems, breadcrumbsParams, orgCode, id]);

  return <Breadcrumb className="ml-7 " items={breadcrumbItems} />;
};

export default memo(BreadcrumbComponent);
