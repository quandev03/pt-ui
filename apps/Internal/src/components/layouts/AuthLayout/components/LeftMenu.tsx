import { MenuItem, MenuObjectItem } from '@react/commons/types';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import { ItemType } from 'antd/es/menu/interface';
import LogoMini from 'apps/Internal/src/assets/images/logo-min.svg';
import Logo from 'apps/Internal/src/assets/images/logo.svg';
import useThemeStore from 'apps/Internal/src/configs/ThemeConfig';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { menuItems } from 'apps/Internal/src/routers/sidebar';
import compact from 'lodash/compact';
import { FC, memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import useConfigAppStore from '../../store';
import useConfigAppNoPersistStore from '../../store/useConfigAppNoPersistStore';
import { StyledMenu, StyledSider } from '../styled';
import { useIsFetching } from '@tanstack/react-query';
import { Spin } from 'antd';

const LeftMenu: FC = memo(() => {
  const { pathname } = useLocation();
  const theme = useThemeStore();
  const { collapsedMenu, toggleCollapsedMenu } = useConfigAppStore();
  const { urlsActive, setMenus, menus } = useConfigAppNoPersistStore();
  const [openMenuKeys, setOpenMenuKeys] = useState<string[]>([]);
  const [selectedMenuKeys, setSelectedMenuKeys] = useState<string[]>([]);
  const { id, orgCode } = useParams();

  const isMenuLoading =
    useIsFetching({
      queryKey: [REACT_QUERY_KEYS.GET_MENU],
    }) > 0;

  const menuData =
    useGetDataFromQueryKey<MenuObjectItem[]>([REACT_QUERY_KEYS.GET_MENU]) ?? [];

  useEffect(() => {
    if (!menuData.length) return;
    setMenus(
      menuItems.filter(
        (item) => urlsActive?.includes(item.key) || item.hasChild === true
      )
    );
  }, [menuData.length, setMenus, urlsActive]);

  const convertMenuItemToItem = useCallback(
    (
      { parentId, label, key, icon, hasChild }: MenuItem,
      isChildMenu?: boolean
    ) => {
      if (parentId && !isChildMenu) return null;
      const isLinked = !menus.some((value: any) => value['parentId'] === key);
      const menuLabel =
        !isLinked || key === pathname ? (
          <div title={label}>{label}</div>
        ) : (
          <Link to={key} title={label}>
            {label}
          </Link>
        );
      const childrens: ItemType[] = menus
        .filter((item) => item['parentId'] === key)
        .map((subItem) => convertMenuItemToItem(subItem, true));
      if (compact(childrens).length === 0 && hasChild === true) return null;
      return {
        key: key,
        icon: icon,
        children: childrens.length ? childrens : null,
        label: menuLabel,
      };
    },
    [menus, pathname]
  );

  const treeItems = useMemo(
    () => compact(menus.map((item) => convertMenuItemToItem(item))),
    [menus, convertMenuItemToItem]
  );

  const getOpenKeys = useCallback(() => {
    const result: string[] = [];
    const pathNameSplit = pathname.split('/');

    const singlePopActions = [
      'add',
      'add-group',
      'add-import',
      'add-export',
      'by-file',
      'add-representative',
    ];
    const doublePopActions = [
      'edit',
      'view',
      'edit-group',
      'view-group',
      'impact-history',
      'package-history',
      'package-capacity',
      'sms-history',
      'copy',
      'user-management',
      'debt-detail',
      'package-authorization',
      'view-import',
      'view-export',
      'view-subscriber',
      'view-history',
    ];
    const patternUserPartner = /^\/partner-catalog\/user-management/;
    const specialSearchTransaction = 'transaction-search-import-export';

    const findParent = (currentKey: string) => {
      const currentRoute = menuItems.find((item) => item.key === currentKey);
      if (currentRoute && currentRoute.parentId) {
        result.unshift(currentRoute.parentId);
        findParent(currentRoute.parentId);
      }
    };

    if (pathNameSplit.some((item) => singlePopActions.includes(item))) {
      pathNameSplit.pop();
      if (patternUserPartner.test(pathname)) {
        pathNameSplit.pop();
        pathNameSplit.pop();
      }

      const name = pathNameSplit.join('/');
      setSelectedMenuKeys([pathNameSplit.join('/')]);
      findParent(name);
    } else if (pathNameSplit.some((item) => doublePopActions.includes(item))) {
      pathNameSplit.pop();
      pathNameSplit.pop();
      if (patternUserPartner.test(pathname) && orgCode && !!id) {
        pathNameSplit.pop();
        pathNameSplit.pop();
      }
      if (pathname.includes(specialSearchTransaction)) {
        pathNameSplit.pop();
      }
      const name = pathNameSplit.join('/');
      setSelectedMenuKeys([pathNameSplit.join('/')]);
      findParent(name);
    } else {
      setSelectedMenuKeys([pathname]);
      result.push(pathname);
      findParent(pathname);
    }

    return result;
  }, [pathname, orgCode, id]);

  const handleChange = () => {
    toggleCollapsedMenu();
  };

  useEffect(() => {
    const result: string[] = getOpenKeys();
    if (collapsedMenu) return;
    setOpenMenuKeys(result);
  }, [getOpenKeys, pathname, collapsedMenu]);

  return (
    <StyledSider
      style={{ background: theme.backGroundWhite }}
      trigger={null}
      collapsible
      collapsed={collapsedMenu}
      width={'17.25rem'}
    >
      <div className="logo">
        {collapsedMenu ? (
          <img
            src={LogoMini}
            alt="Logo"
            onClick={handleChange}
            style={{ cursor: 'pointer' }}
          />
        ) : (
          <img src={Logo} alt="Logo" width="162" />
        )}
      </div>
      <div className="wrapMenu">
        {isMenuLoading ? (
          <div className="flex justify-center items-center h-full">
            <Spin />
          </div>
        ) : (
          <StyledMenu
            mode="inline"
            items={treeItems}
            openKeys={openMenuKeys}
            onOpenChange={setOpenMenuKeys}
            selectedKeys={selectedMenuKeys}
            inlineIndent={12}
          />
        )}
      </div>
    </StyledSider>
  );
});

export default LeftMenu;
