import { MenuItem, MenuObjectItem } from '@react/commons/types';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import { ItemType } from 'antd/es/menu/interface';
import LogoMini from 'apps/Partner/src/assets/images/logo-min.svg';
import Logo from 'apps/Partner/src/assets/images/logo.svg';
import { REACT_QUERY_KEYS } from 'apps/Partner/src/constants/querykeys';
import { menuItems } from 'apps/Partner/src/routers/sidebar';
import { compact } from 'lodash';
import { FC, memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useThemeStore from '../../../../configs/ThemeConfig';
import useConfigAppStore from '../../store';
import useConfigAppNoPersistStore from '../../store/useConfigAppNoPersistStore';
import { StyledMenu, StyledSider } from '../styled';

const LeftMenu: FC = memo(() => {
  const { pathname } = useLocation();
  const theme = useThemeStore();
  const { collapsedMenu, toggleCollapsedMenu } = useConfigAppStore();
  const { urlsActive, setMenus, menus } = useConfigAppNoPersistStore();
  const [openMenuKeys, setOpenMenuKeys] = useState<string[]>([]);
  const [selectedMenuKeys, setSelectedMenuKeys] = useState<string[]>([]);
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
      const isLinked = !menus.some((value) => value['parentId'] === key);
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

    const singlePopActions = ['add', 'add-group'];
    const doublePopActions = [
      'edit',
      'view',
      'edit-group',
      'view-group',
      'impact-history',
      'copy',
      'partner-catalog',
      'user-management',
    ];

    const findParent = (currentKey: string) => {
      const currentRoute = menuItems.find((item) => item.key === currentKey);
      if (currentRoute && currentRoute.parentId) {
        result.unshift(currentRoute.parentId);
        findParent(currentRoute.parentId);
      }
    };

    if (pathNameSplit.some((item) => singlePopActions.includes(item))) {
      pathNameSplit.pop();
      const name = pathNameSplit.join('/');
      setSelectedMenuKeys([pathNameSplit.join('/')]);
      findParent(name);
    } else if (pathNameSplit.some((item) => doublePopActions.includes(item))) {
      pathNameSplit.pop();
      pathNameSplit.pop();
      const name = pathNameSplit.join('/');
      setSelectedMenuKeys([pathNameSplit.join('/')]);
      findParent(name);
    } else {
      setSelectedMenuKeys([pathname]);
      result.push(pathname);
      findParent(pathname);
    }
    return result;
  }, [pathname]);

  const handleChange = () => {
    toggleCollapsedMenu();
  };

  useEffect(() => {
    const result: string[] = getOpenKeys();
    setOpenMenuKeys(result);
  }, [getOpenKeys, pathname]);

  return (
    <StyledSider
      style={{ background: theme.backGroundWhite }}
      trigger={null}
      collapsible
      collapsed={collapsedMenu}
      width={'16.25rem'}
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
        <StyledMenu
          mode="inline"
          items={treeItems}
          openKeys={openMenuKeys}
          onOpenChange={setOpenMenuKeys}
          selectedKeys={selectedMenuKeys}
        />
      </div>
      {/* <ChangeLanguage /> */}
    </StyledSider>
  );
});

export default LeftMenu;
