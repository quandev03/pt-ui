import { Breadcrumb } from 'antd';
import {
  BreadcrumbItemType,
  BreadcrumbSeparatorType,
} from 'antd/es/breadcrumb/Breadcrumb';
import { Home } from 'lucide-react';
import React, { memo, useCallback, useMemo } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { RouterItems } from '../../../types';

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
    key: 'history',
    label: 'Lịch sử điểm',
  },
];

interface IBreadcrumbComponentProps {
  routerItems: RouterItems[];
}

export const BreadcrumbComponent: React.FC<IBreadcrumbComponentProps> = memo(
  ({ routerItems }) => {
    const { pathname } = useLocation();
    const { unitId, id } = useParams<{ unitId: string; id: string }>();
    const getLabelFromMenuItems = useCallback(
      (key: string): string => {
        const menuItem = routerItems.find((item) => item.key === `/${key}`);
        return menuItem ? menuItem.label : key;
      },
      [routerItems]
    );

    const getItemFromMenuItems = useCallback(
      (key: string) => {
        return routerItems.find(
          (item) => item.key === `/${key}` || item.key === key
        );
      },
      [routerItems]
    );

    const getParentItemFromMenuItems = useCallback(
      (key: string) => {
        const result: string[] = [];
        const menuItem = routerItems.find((item) => item.key === key);
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
      },
      [routerItems]
    );

    const breadcrumbItems = useMemo(() => {
      let pathSnippets = pathname.split('/').filter((i) => i);
      const parentItem = getParentItemFromMenuItems(`/${pathSnippets[0]}`);
      if (parentItem.length > 1) parentItem.shift();
      parentItem.reverse();
      pathSnippets = parentItem.concat(pathSnippets);

      const resultNode: Partial<
        BreadcrumbItemType & BreadcrumbSeparatorType
      >[] = pathSnippets.map((_) => {
        const itemInMenus = getItemFromMenuItems(_);
        const item: Partial<BreadcrumbItemType & BreadcrumbSeparatorType> = {
          title: null,
        };
        if (itemInMenus) {
          item.title = !itemInMenus.hasChild ? (
            <Link to={itemInMenus.key}>
              {itemInMenus.icon ? itemInMenus.icon : null} {itemInMenus.label}
            </Link>
          ) : (
            itemInMenus.label
          );
        } else {
          item.title = getLabelFromMenuItems(_);
        }
        const nameSpecial = specialPaths.find((item) => _ === item.key);
        if (nameSpecial) item.title = nameSpecial.label;
        if (_ === id || _ === unitId) {
          item.title = '';
        }

        return item;
      });

      resultNode.unshift({
        href: `/`,
        title: <Home size={18} />,
      });
      if (pathname === `/`) {
        resultNode.push({
          title: 'Trang chủ',
        });
      }

      return resultNode.filter((item) => item.title);
    }, [
      pathname,
      getParentItemFromMenuItems,
      getItemFromMenuItems,
      id,
      unitId,
      getLabelFromMenuItems,
    ]);

    return <Breadcrumb className="mt-3 !pl-7" items={breadcrumbItems} />;
  }
);
