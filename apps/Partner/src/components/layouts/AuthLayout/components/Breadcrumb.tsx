import { Breadcrumb } from 'antd';
import React, { memo, useCallback, useMemo } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { menuItems } from 'apps/Partner/src/routers/sidebar';
import { pathRoutes } from 'apps/Partner/src/constants/routes';
import {
  BreadcrumbItemType,
  BreadcrumbSeparatorType,
} from 'antd/es/breadcrumb/Breadcrumb';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useConfigAppNoPersistStore from 'apps/Partner/src/components/layouts/store/useConfigAppNoPersistStore';
import { uniq } from 'lodash';

const specialPaths = [
  {
    key: 'view',
    label: 'Xem chi tiết',
  },
  {
    key: 'add',
    label: 'Tạo mới',
  },
  {
    key: 'edit',
    label: 'Chỉnh sửa',
  },
  {
    key: 'user-management',
    label: 'Quản lý user đối tác',
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
    if (parentItem.length > 1) parentItem.shift();
    parentItem.reverse();
    pathSnippets = uniq(parentItem.concat(pathSnippets));

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
        const nameSpecial = specialPaths.find((item) => item.key === _);
        if (nameSpecial) item.title = nameSpecial.label;
        if (_ === orgCode) {
          const url = pathname.split(orgCode);
          item.title = (
            <Link to={url[0] + orgCode}>
              {breadcrumbsParams.orgCode ?? orgCode}
            </Link>
          );
        } else if (_ === id) {
          const url = pathname.split(id);
          item.title = (
            <Link to={url[0] + id}>{breadcrumbsParams.id ?? id}</Link>
          );
        }
        return item;
      });

    resultNode.unshift({
      href: pathRoutes.welcome,
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

    return resultNode;
  }, [pathname, getLabelFromMenuItems, breadcrumbsParams, orgCode, id]);

  return <Breadcrumb className="ml-7 mt-3" items={breadcrumbItems} />;
};

export default memo(BreadcrumbComponent);
