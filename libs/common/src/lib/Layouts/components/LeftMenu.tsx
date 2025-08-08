import { FC, memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Logo from '../../../assets/images/Logo-mini.svg';
import LogoMini from '../../../assets/images/Logo.svg';
import { ThemesType } from '../../../constants';
import { useGetLoaderData } from '../../../hooks';
import { ILayoutService, RouterItems } from '../../../types';
import { StyledMenu, StyledSider } from '../styled';

interface ILeftMenuProps {
  routerItems: RouterItems[];
  specialActions: string[];
  singlePopActions: string[];
  doublePopActions: string[];
  LayoutService: ILayoutService;
  themeConfig: ThemesType;
  collapsedMenu: boolean;
  toggleCollapsedMenu: () => void;
}

export const LeftMenu: FC<ILeftMenuProps> = memo(
  ({
    routerItems,
    specialActions,
    singlePopActions,
    doublePopActions,
    LayoutService,
    themeConfig,
    collapsedMenu,
    toggleCollapsedMenu,
  }) => {
    console.log('collapsedMenu', collapsedMenu);
    const { menus } = useGetLoaderData();
    const { pathname } = useLocation();
    const menusData = useMemo(() => {
      return LayoutService.mappingMenus(menus, pathname);
    }, [LayoutService, menus, pathname]);
    const [openMenuKeys, setOpenMenuKeys] = useState<string[]>([]);
    const [selectedMenuKeys, setSelectedMenuKeys] = useState<string[]>([]);

    const getOpenKeys = useCallback(() => {
      const result: string[] = [];
      const pathNameSplit = pathname.split('/');
      const findParent = (currentKey: string) => {
        const currentRoute = routerItems.find(
          (item) => item.key === currentKey
        );
        if (currentRoute && currentRoute.parentId) {
          result.unshift(currentRoute.parentId);
          findParent(currentRoute.parentId);
        }
      };

      if (pathNameSplit.some((item) => singlePopActions.includes(item))) {
        const basePath = pathNameSplit.slice(0, -1).join('/');
        setSelectedMenuKeys([basePath]);
        findParent(basePath);
      } else if (
        pathNameSplit.some((item) => doublePopActions.includes(item))
      ) {
        const basePath = pathNameSplit.slice(0, -2).join('/');
        setSelectedMenuKeys([basePath]);
        findParent(basePath);
      } else {
        setSelectedMenuKeys([pathname]);
        result.push(pathname);
        findParent(pathname);
      }
      return result;
    }, [
      doublePopActions,
      routerItems,
      pathname,
      singlePopActions,
      specialActions,
    ]);

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
        style={{ background: themeConfig.backGroundWhite }}
        trigger={null}
        collapsible
        collapsed={collapsedMenu}
        // width={'17.25rem'}
      >
        <div className="logo mb-2">
          {collapsedMenu ? (
            <img
              src={LogoMini}
              alt="Logo"
              onClick={handleChange}
              style={{ cursor: 'pointer' }}
            />
          ) : (
            <img src={Logo} alt="Logo" width={'50%'} />
          )}
        </div>
        <div className="wrapMenu">
          <StyledMenu
            mode="inline"
            items={menusData}
            openKeys={openMenuKeys}
            onOpenChange={setOpenMenuKeys}
            selectedKeys={selectedMenuKeys}
            inlineIndent={12}
          />
        </div>
      </StyledSider>
    );
  }
);
